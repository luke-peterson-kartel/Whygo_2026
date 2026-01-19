import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, {
  name: 'whygo-clear-script'
});
const db = getFirestore(app);

async function clearWhyGOs() {
  console.log('🗑️  Deleting all WhyGOs from Firestore...\n');

  const whygosRef = collection(db, 'whygos');
  const snapshot = await getDocs(whygosRef);

  console.log(`   Found ${snapshot.size} WhyGOs to delete`);

  let deletedWhyGOs = 0;
  let deletedOutcomes = 0;

  for (const whygoDoc of snapshot.docs) {
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
