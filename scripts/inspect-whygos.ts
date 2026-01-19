import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig, { name: 'inspect-script' });
const db = getFirestore(app);

async function inspectWhyGOs() {
  const snapshot = await getDocs(collection(db, 'whygos'));

  console.log('\n=== FIRESTORE WHYGO INSPECTION ===');
  console.log(`Total documents: ${snapshot.size}\n`);

  const byLevel: Record<string, number> = {};
  const companyWhyGOs: any[] = [];
  const deptWhyGOs: any[] = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const level = data.level || 'undefined';
    byLevel[level] = (byLevel[level] || 0) + 1;

    if (level === 'company') {
      companyWhyGOs.push({ id: doc.id, goal: data.goal });
    } else if (level === 'department') {
      deptWhyGOs.push({ id: doc.id, dept: data.department, goal: data.goal });
    }
  });

  console.log('Breakdown by level:');
  Object.entries(byLevel).forEach(([level, count]) => {
    console.log(`  ${level}: ${count}`);
  });

  console.log('\n=== COMPANY WHYGOS (should be 4) ===');
  companyWhyGOs.forEach((w, i) => {
    console.log(`${i + 1}. ${w.goal?.substring(0, 70)}...`);
    console.log(`   ID: ${w.id}\n`);
  });

  console.log('\n=== DEPARTMENT WHYGOS (should be 14) ===');
  const grouped: Record<string, number> = {};
  deptWhyGOs.forEach((w) => {
    grouped[w.dept] = (grouped[w.dept] || 0) + 1;
  });
  Object.entries(grouped).forEach(([dept, count]) => {
    console.log(`  ${dept}: ${count} WhyGOs`);
  });
}

inspectWhyGOs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
