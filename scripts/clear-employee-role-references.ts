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
  name: 'role-ref-clear-script'
});
const db = getFirestore(app);

async function clearEmployeeRoleReferences() {
  console.log('🗑️  Deleting all employee role references from Firestore...\n');

  const roleRefsRef = collection(db, 'employeeRoleReferences');
  const snapshot = await getDocs(roleRefsRef);

  console.log(`   Found ${snapshot.size} role references to delete`);

  let deleted = 0;

  for (const roleRefDoc of snapshot.docs) {
    await deleteDoc(doc(db, 'employeeRoleReferences', roleRefDoc.id));
    deleted++;

    if (deleted % 5 === 0) {
      console.log(`   Deleted ${deleted} role references...`);
    }
  }

  console.log('\n✅ All employee role references deleted!');
  console.log(`   Total: ${deleted}`);
}

clearEmployeeRoleReferences()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
