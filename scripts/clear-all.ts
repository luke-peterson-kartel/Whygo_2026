import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

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

async function clearCollection(collectionName: string, subCollections?: string[]) {
  console.log(`\n🗑️  Clearing ${collectionName}...`);

  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  console.log(`   Found ${snapshot.size} documents`);

  let deleted = 0;
  let subDeleted = 0;

  for (const docSnapshot of snapshot.docs) {
    // Delete subcollections if specified
    if (subCollections) {
      for (const subCollectionName of subCollections) {
        const subRef = docSnapshot.ref.collection(subCollectionName);
        const subSnapshot = await subRef.get();

        for (const subDoc of subSnapshot.docs) {
          await subDoc.ref.delete();
          subDeleted++;
        }
      }
    }

    // Delete main document
    await docSnapshot.ref.delete();
    deleted++;

    if (deleted % 10 === 0) {
      console.log(`   Deleted ${deleted}...`);
    }
  }

  console.log(`✅ Deleted ${deleted} documents`);
  if (subDeleted > 0) {
    console.log(`   └─ Including ${subDeleted} subdocuments`);
  }
}

async function clearAll() {
  console.log('\n⚠️  WARNING: This will delete ALL data from Firestore!\n');
  console.log('Collections to be cleared:');
  console.log('  - whygos (with outcomes subcollection)');
  console.log('  - employees');
  console.log('  - employeeRoleReferences\n');

  // Prompt for confirmation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const confirmed = await new Promise<boolean>((resolve) => {
    rl.question('Type "DELETE ALL" to confirm: ', (answer) => {
      rl.close();
      resolve(answer === 'DELETE ALL');
    });
  });

  if (!confirmed) {
    console.log('\n❌ Cancelled. No data was deleted.');
    return;
  }

  console.log('\n🚀 Starting deletion process...');

  // Clear all collections
  await clearCollection('whygos', ['outcomes']);
  await clearCollection('employees');
  await clearCollection('employeeRoleReferences');

  console.log('\n✅ All collections cleared!');
  console.log('\n💡 Ready for fresh migration from CSV files.');
}

clearAll()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
