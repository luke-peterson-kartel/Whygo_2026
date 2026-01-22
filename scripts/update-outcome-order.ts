import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig, { name: 'update-order-script' });
const db = getFirestore(app);

// Define the desired order for the "Onboard 10 enterprise clients" WhyGO outcomes
// Map description patterns (case-insensitive partial match) to their new sort order
const OUTCOME_ORDER: Record<string, number> = {
  'enterprise clients signed': 1,
  'revenue closed': 2,
  'case studies published': 3,
  'verticals with 2+': 4,
};

async function updateOutcomeOrder() {
  // Find company level WhyGOs
  const whygosSnapshot = await getDocs(collection(db, 'whygos'));

  console.log('\n=== UPDATING OUTCOME ORDER FOR COMPANY WHYGOS ===\n');

  for (const whygoDoc of whygosSnapshot.docs) {
    const whygoData = whygoDoc.data();

    // Only process company-level WhyGOs
    if (whygoData.level !== 'company') continue;

    console.log(`\nProcessing WhyGO: "${whygoData.goal?.substring(0, 60)}..."`);
    console.log(`  ID: ${whygoDoc.id}`);

    // Get outcomes subcollection
    const outcomesRef = collection(db, 'whygos', whygoDoc.id, 'outcomes');
    const outcomesSnapshot = await getDocs(outcomesRef);

    console.log(`  Found ${outcomesSnapshot.size} outcomes`);

    for (const outcomeDoc of outcomesSnapshot.docs) {
      const outcomeData = outcomeDoc.data();
      const description = outcomeData.description || '';

      // Find matching sort order (case-insensitive)
      let newSortOrder: number | null = null;
      const descLower = description.toLowerCase();
      for (const [pattern, order] of Object.entries(OUTCOME_ORDER)) {
        if (descLower.includes(pattern.toLowerCase())) {
          newSortOrder = order;
          break;
        }
      }

      if (newSortOrder !== null) {
        const currentOrder = outcomeData.sortOrder;
        console.log(`    - "${description.substring(0, 40)}..."`);
        console.log(`      Current sortOrder: ${currentOrder}, New sortOrder: ${newSortOrder}`);

        if (currentOrder !== newSortOrder) {
          // Update the sortOrder
          const outcomeRef = doc(db, 'whygos', whygoDoc.id, 'outcomes', outcomeDoc.id);
          await updateDoc(outcomeRef, { sortOrder: newSortOrder });
          console.log(`      ✓ Updated!`);
        } else {
          console.log(`      (no change needed)`);
        }
      } else {
        console.log(`    - "${description.substring(0, 40)}..." - No matching pattern`);
      }
    }
  }

  console.log('\n=== DONE ===\n');
}

// Run with --dry-run to just inspect without making changes
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('DRY RUN MODE - No changes will be made\n');
  // Just inspect
  async function inspect() {
    const whygosSnapshot = await getDocs(collection(db, 'whygos'));

    for (const whygoDoc of whygosSnapshot.docs) {
      const whygoData = whygoDoc.data();
      if (whygoData.level !== 'company') continue;

      console.log(`\nWhyGO: "${whygoData.goal?.substring(0, 60)}..."`);

      const outcomesRef = collection(db, 'whygos', whygoDoc.id, 'outcomes');
      const outcomesSnapshot = await getDocs(outcomesRef);

      const outcomes = outcomesSnapshot.docs.map(d => ({
        description: d.data().description,
        sortOrder: d.data().sortOrder
      }));

      outcomes.sort((a, b) => a.sortOrder - b.sortOrder);

      console.log('  Current order:');
      outcomes.forEach((o, i) => {
        console.log(`    ${i + 1}. (sortOrder: ${o.sortOrder}) ${o.description}`);
      });
    }
  }

  inspect()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error:', err);
      process.exit(1);
    });
} else {
  updateOutcomeOrder()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error:', err);
      process.exit(1);
    });
}
