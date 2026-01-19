/**
 * WhyGO Migration Script
 *
 * Parses markdown WhyGO files and imports them into Firestore
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseWhyGOMarkdown, generateWhyGOId, generateOutcomeId } from '../src/lib/markdown/whygoParser.js';

// ES module equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../firebase-service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Paths to WhyGO markdown files
const WHYGO_PATHS = {
  company: path.join(__dirname, '../WhyGos/WHYGOS _Company_Department/Company Whygos/Kartel_AI_Company_WhyGO__2026(Final).md'),
  departments: [
    path.join(__dirname, '../WhyGos/WHYGOS _Company_Department/Department Whygos/Sales_Department_WhyGOs__2026(Final).md'),
    path.join(__dirname, '../WhyGos/WHYGOS _Company_Department/Department Whygos/Production_Department_WhyGOs_2026(Final).md'),
    path.join(__dirname, '../WhyGos/WHYGOS _Company_Department/Department Whygos/Platform_Department_WhyGOs__2026(Final).md'),
    path.join(__dirname, '../WhyGos/WHYGOS _Company_Department/Department Whygos/Generative_Department_WhyGOs_2026(Final).md'),
    path.join(__dirname, '../WhyGos/WHYGOS _Company_Department/Department Whygos/Community_Department_WhyGOs_2026 (Final).md'),
  ],
};

async function migrateWhyGOs() {
  console.log('🚀 Starting WhyGO migration...\n');

  let totalWhyGOs = 0;
  let totalOutcomes = 0;

  try {
    // Migrate company WhyGOs
    console.log('📊 Migrating Company WhyGOs...');
    const companyResults = await migrateFile(WHYGO_PATHS.company);
    totalWhyGOs += companyResults.whygos;
    totalOutcomes += companyResults.outcomes;

    // Migrate department WhyGOs
    console.log('\n📊 Migrating Department WhyGOs...');
    for (const deptPath of WHYGO_PATHS.departments) {
      const deptResults = await migrateFile(deptPath);
      totalWhyGOs += deptResults.whygos;
      totalOutcomes += deptResults.outcomes;
    }

    console.log('\n✅ Migration complete!');
    console.log(`   Total WhyGOs: ${totalWhyGOs}`);
    console.log(`   Total Outcomes: ${totalOutcomes}`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

async function migrateFile(filePath: string): Promise<{ whygos: number; outcomes: number }> {
  const fileName = path.basename(filePath);
  console.log(`   Processing: ${fileName}`);

  // Read file
  const content = fs.readFileSync(filePath, 'utf8');

  // Parse WhyGOs
  const parsedWhyGOs = parseWhyGOMarkdown(content, filePath);

  if (parsedWhyGOs.length === 0) {
    console.log(`   ⚠️  No WhyGOs found in ${fileName}`);
    return { whygos: 0, outcomes: 0 };
  }

  let whygoCount = 0;
  let outcomeCount = 0;

  // Import each WhyGO
  for (const whygo of parsedWhyGOs) {
    const whygoId = generateWhyGOId(whygo);

    // Prepare WhyGO document
    const whygoDoc = {
      id: whygoId,
      level: whygo.level,
      year: whygo.year,
      department: whygo.department || null,
      ownerId: whygo.ownerId,
      ownerName: whygo.ownerName,
      why: whygo.why,
      goal: whygo.goal,
      status: whygo.status,
      parentWhyGOId: null, // Will be set manually or through alignment logic
      approvedBy: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metadata: {
        lastUpdated: whygo.metadata.lastUpdated,
        source: 'markdown_migration',
        sourceFile: fileName,
      },
    };

    // Write WhyGO to Firestore
    await db.collection('whygos').doc(whygoId).set(whygoDoc);
    whygoCount++;

    console.log(`   ✓ WhyGO: ${whygo.goal.substring(0, 60)}...`);

    // Import outcomes as subcollection
    for (let i = 0; i < whygo.outcomes.length; i++) {
      const outcome = whygo.outcomes[i];
      const outcomeId = generateOutcomeId(whygoId, i + 1);

      const outcomeDoc = {
        id: outcomeId,
        description: outcome.description,
        annualTarget: outcome.annualTarget,
        unit: outcome.unit,
        q1Target: outcome.q1Target,
        q2Target: outcome.q2Target,
        q3Target: outcome.q3Target,
        q4Target: outcome.q4Target,
        q1Actual: null,
        q2Actual: null,
        q3Actual: null,
        q4Actual: null,
        q1Status: 'not_started',
        q2Status: 'not_started',
        q3Status: 'not_started',
        q4Status: 'not_started',
        ownerId: outcome.ownerId,
        ownerName: outcome.ownerName,
        sortOrder: outcome.sortOrder,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await db.collection('whygos').doc(whygoId).collection('outcomes').doc(outcomeId).set(outcomeDoc);
      outcomeCount++;

      console.log(`      → Outcome ${i + 1}: ${outcome.description.substring(0, 50)}...`);
    }
  }

  console.log(`   ✓ Imported ${whygoCount} WhyGOs with ${outcomeCount} outcomes\n`);

  return { whygos: whygoCount, outcomes: outcomeCount };
}

// Run migration
migrateWhyGOs()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
