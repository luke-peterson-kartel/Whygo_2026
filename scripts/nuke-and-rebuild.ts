import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig, { name: 'nuke-script' });
const db = getFirestore(app);

async function nukeAllWhyGOs() {
  console.log('💣 NUKING ALL WHYGOS FROM FIRESTORE...\n');

  const whygosRef = collection(db, 'whygos');
  const snapshot = await getDocs(whygosRef);

  console.log(`   Found ${snapshot.size} WhyGOs to delete\n`);

  if (snapshot.size === 0) {
    console.log('   No WhyGOs found. Database is already clean.\n');
    return 0;
  }

  let deletedWhyGOs = 0;
  let deletedOutcomes = 0;

  // Delete in batches of 10
  for (let i = 0; i < snapshot.docs.length; i++) {
    const whygoDoc = snapshot.docs[i];

    // Delete outcomes subcollection first
    const outcomesRef = collection(db, 'whygos', whygoDoc.id, 'outcomes');
    const outcomesSnapshot = await getDocs(outcomesRef);

    for (const outcomeDoc of outcomesSnapshot.docs) {
      await deleteDoc(doc(db, 'whygos', whygoDoc.id, 'outcomes', outcomeDoc.id));
      deletedOutcomes++;
    }

    // Delete WhyGO document
    await deleteDoc(doc(db, 'whygos', whygoDoc.id));
    deletedWhyGOs++;

    if (deletedWhyGOs % 10 === 0) {
      console.log(`   Deleted ${deletedWhyGOs}/${snapshot.size} WhyGOs...`);
    }
  }

  console.log(`\n✅ Deleted ${deletedWhyGOs} WhyGOs and ${deletedOutcomes} outcomes\n`);
  return deletedWhyGOs;
}

async function main() {
  try {
    // Step 1: Nuke everything
    const deleted = await nukeAllWhyGOs();

    if (deleted > 0) {
      // Wait 2 seconds for Firestore to propagate
      console.log('⏳ Waiting 2 seconds for Firestore to propagate...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Step 2: Re-migrate
    console.log('🔄 Running migration...\n');
    execSync('npm run migrate:whygos', { stdio: 'inherit' });

    console.log('\n✅ COMPLETE! Database rebuilt successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
