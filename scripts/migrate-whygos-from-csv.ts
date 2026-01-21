import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

interface WhyGOCSVRow {
  Level: string;
  Department: string;
  'WhyGO ID': string;
  'WhyGO Owner': string;
  'Why Statement': string;
  'Goal Statement': string;
  Status: string;
  'Approved By': string;
  'Outcome Description': string;
  'Outcome Owner': string;
  'Annual Target': string;
  'Q1 Target': string;
  'Q2 Target': string;
  'Q3 Target': string;
  'Q4 Target': string;
  Unit: string;
}

interface EmployeeCSVRow {
  Name: string;
  Email: string;
}

/**
 * Build name-to-email lookup map from employee CSV
 */
function buildNameToEmailMap(): Map<string, string> {
  const csvPath = path.join(__dirname, '../employees_2026 (job, roll, reports).csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as EmployeeCSVRow[];

  const map = new Map<string, string>();

  for (const row of records) {
    const name = row.Name.trim();
    const email = row.Email.toLowerCase().trim();
    map.set(name, email);
  }

  return map;
}

/**
 * Get email from name using lookup map
 * Handles both full names and first names
 */
function getEmailFromName(name: string, nameToEmailMap: Map<string, string>): string {
  const trimmedName = name.trim();

  // Handle special cases with multiple names or teams
  if (trimmedName.includes('+') || trimmedName.toLowerCase().includes('team')) {
    // For "Fill + Niels" or "Fill + Team", just take the first person
    const firstName = trimmedName.split('+')[0].trim();
    return getEmailFromName(firstName, nameToEmailMap);
  }

  // Handle asterisk (e.g., "Ben*")
  const cleanedName = trimmedName.replace(/\*/g, '').trim();

  // Direct lookup (full name)
  if (nameToEmailMap.has(cleanedName)) {
    return nameToEmailMap.get(cleanedName)!;
  }

  // Case-insensitive lookup (full name)
  for (const [key, value] of nameToEmailMap.entries()) {
    if (key.toLowerCase() === cleanedName.toLowerCase()) {
      return value;
    }
  }

  // First name only lookup (check if cleaned name matches start of full name)
  for (const [key, value] of nameToEmailMap.entries()) {
    const fullName = key.toLowerCase();
    const searchName = cleanedName.toLowerCase();

    // Check if it's just a first name match
    if (fullName.startsWith(searchName + ' ') || fullName === searchName) {
      return value;
    }
  }

  // If not found, log warning and return placeholder
  console.warn(`⚠️  Warning: Could not find email for "${trimmedName}"`);
  return `unknown@kartel.ai`;
}

/**
 * Parse numeric value from string (handles empty, commas, etc.)
 */
function parseNumeric(value: string): number {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalize level to Firestore format
 */
function normalizeLevel(level: string): 'company' | 'department' | 'individual' {
  const normalized = level.toLowerCase().trim();
  if (normalized === 'company') return 'company';
  if (normalized === 'department' || normalized === 'dept') return 'department';
  return 'individual';
}

/**
 * Normalize status to Firestore format
 */
function normalizeStatus(status: string): 'draft' | 'active' | 'archived' {
  const normalized = status.toLowerCase().trim();
  if (normalized === 'active') return 'active';
  if (normalized === 'archived') return 'archived';
  return 'draft';
}

async function migrateWhyGOsFromCSV() {
  try {
    console.log('🚀 Starting WhyGO migration from CSV...\n');

    // Build name-to-email lookup map
    console.log('📇 Building name-to-email lookup map...');
    const nameToEmailMap = buildNameToEmailMap();
    console.log(`   Loaded ${nameToEmailMap.size} employee name mappings\n`);

    // Read WhyGO CSV file
    const csvPath = path.join(__dirname, '../whygos_2026_Final.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Parse CSV
    console.log('📄 Parsing WhyGO CSV file...');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as WhyGOCSVRow[];

    console.log(`   Found ${records.length} outcome rows in CSV\n`);

    // Group outcomes by WhyGO ID
    console.log('🔄 Grouping outcomes by WhyGO...');
    const whygoMap = new Map<string, {
      whygo: Omit<WhyGOCSVRow, 'Outcome Description' | 'Outcome Owner' | 'Annual Target' | 'Q1 Target' | 'Q2 Target' | 'Q3 Target' | 'Q4 Target' | 'Unit'>;
      outcomes: Array<{
        description: string;
        owner: string;
        annualTarget: number;
        q1Target: number;
        q2Target: number;
        q3Target: number;
        q4Target: number;
        unit: string;
      }>;
    }>();

    for (const row of records) {
      const whygoId = row['WhyGO ID'];

      if (!whygoMap.has(whygoId)) {
        whygoMap.set(whygoId, {
          whygo: {
            Level: row.Level,
            Department: row.Department,
            'WhyGO ID': row['WhyGO ID'],
            'WhyGO Owner': row['WhyGO Owner'],
            'Why Statement': row['Why Statement'],
            'Goal Statement': row['Goal Statement'],
            Status: row.Status,
            'Approved By': row['Approved By'],
          },
          outcomes: [],
        });
      }

      const whygoData = whygoMap.get(whygoId)!;
      whygoData.outcomes.push({
        description: row['Outcome Description'],
        owner: row['Outcome Owner'],
        annualTarget: parseNumeric(row['Annual Target']),
        q1Target: parseNumeric(row['Q1 Target']),
        q2Target: parseNumeric(row['Q2 Target']),
        q3Target: parseNumeric(row['Q3 Target']),
        q4Target: parseNumeric(row['Q4 Target']),
        unit: row.Unit,
      });
    }

    console.log(`   Grouped into ${whygoMap.size} unique WhyGOs\n`);

    // Migrate WhyGOs to Firestore
    console.log('🎯 Migrating WhyGOs to Firestore...');
    let whygoCount = 0;
    let outcomeCount = 0;

    for (const [whygoId, data] of whygoMap.entries()) {
      const { whygo, outcomes } = data;

      // Get owner email
      const ownerEmail = getEmailFromName(whygo['WhyGO Owner'], nameToEmailMap);

      // Create WhyGO document
      const whygoDocData = {
        level: normalizeLevel(whygo.Level),
        department: whygo.Department || null,
        why: whygo['Why Statement'],
        goal: whygo['Goal Statement'],
        ownerId: ownerEmail,
        ownerName: whygo['WhyGO Owner'],
        status: normalizeStatus(whygo.Status),
        approvedBy: whygo['Approved By'] || null,
        year: 2026,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('whygos').doc(whygoId).set(whygoDocData);
      whygoCount++;

      // Create outcome subcollection documents
      for (let i = 0; i < outcomes.length; i++) {
        const outcome = outcomes[i];
        const outcomeId = `${whygoId}_o${i + 1}`;
        const outcomeOwnerEmail = getEmailFromName(outcome.owner, nameToEmailMap);

        const outcomeData = {
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
          ownerId: outcomeOwnerEmail,
          ownerName: outcome.owner,
          q1Status: null,
          q2Status: null,
          q3Status: null,
          q4Status: null,
          sortOrder: i + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db
          .collection('whygos')
          .doc(whygoId)
          .collection('outcomes')
          .doc(outcomeId)
          .set(outcomeData);

        outcomeCount++;
      }

      if (whygoCount % 5 === 0) {
        console.log(`   Migrated ${whygoCount} WhyGOs...`);
      }
    }

    console.log('\n✅ Migration complete!');
    console.log(`   WhyGOs created: ${whygoCount}`);
    console.log(`   Outcomes created: ${outcomeCount}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateWhyGOsFromCSV();
