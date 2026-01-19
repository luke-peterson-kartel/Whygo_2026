/**
 * Clear WhyGOs Script
 *
 * Deletes all WhyGO documents and their outcomes from Firestore
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

async function clearWhyGOs() {
  console.log('🧹 Clearing all WhyGOs from Firestore...\n');

  const whygosSnapshot = await db.collection('whygos').get();
  let deletedCount = 0;

  for (const doc of whygosSnapshot.docs) {
    // Delete outcomes subcollection first
    const outcomesSnapshot = await db.collection('whygos').doc(doc.id).collection('outcomes').get();
    for (const outcomeDoc of outcomesSnapshot.docs) {
      await outcomeDoc.ref.delete();
    }

    // Delete whygo document
    await doc.ref.delete();
    console.log(`   ✓ Deleted WhyGO: ${doc.id}`);
    deletedCount++;
  }

  console.log(`\n✅ Cleared ${deletedCount} WhyGOs\n`);
}

// Run cleanup
clearWhyGOs()
  .then(() => {
    console.log('🎉 Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error during cleanup:', error);
    process.exit(1);
  });
