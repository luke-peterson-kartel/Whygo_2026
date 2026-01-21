import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

async function clearWhyGOs() {
  console.log('🗑️  Deleting all WhyGOs from Firestore...\n');

  const whygosRef = db.collection('whygos');
  const snapshot = await whygosRef.get();

  console.log(`   Found ${snapshot.size} WhyGOs to delete`);

  let deletedWhyGOs = 0;
  let deletedOutcomes = 0;

  for (const whygoDoc of snapshot.docs) {
    // Delete outcomes subcollection first
    const outcomesRef = whygoDoc.ref.collection('outcomes');
    const outcomesSnapshot = await outcomesRef.get();

    for (const outcomeDoc of outcomesSnapshot.docs) {
      await outcomeDoc.ref.delete();
      deletedOutcomes++;
    }

    // Delete WhyGO document
    await whygoDoc.ref.delete();
    deletedWhyGOs++;

    if (deletedWhyGOs % 5 === 0) {
      console.log(`   Deleted ${deletedWhyGOs} WhyGOs...`);
    }
  }

  console.log('\n✅ All WhyGOs deleted!');
  console.log(`   Total WhyGOs: ${deletedWhyGOs}`);
  console.log(`   Total Outcomes: ${deletedOutcomes}`);
}

clearWhyGOs()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
