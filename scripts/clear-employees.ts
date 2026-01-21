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
  name: 'employee-clear-script'
});
const db = getFirestore(app);

async function clearEmployees() {
  console.log('🗑️  Deleting all employees from Firestore...\n');

  const employeesRef = collection(db, 'employees');
  const snapshot = await getDocs(employeesRef);

  console.log(`   Found ${snapshot.size} employees to delete`);

  let deleted = 0;

  for (const employeeDoc of snapshot.docs) {
    await deleteDoc(doc(db, 'employees', employeeDoc.id));
    deleted++;

    if (deleted % 5 === 0) {
      console.log(`   Deleted ${deleted} employees...`);
    }
  }

  console.log('\n✅ All employees deleted!');
  console.log(`   Total: ${deleted}`);
}

clearEmployees()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
