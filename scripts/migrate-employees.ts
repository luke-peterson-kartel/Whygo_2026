/**
 * Employee Data Migration Script
 *
 * This script imports all 22 Kartel AI employees from EMPLOYEE_REFERENCE.md
 * into Firestore with proper structure and relationships.
 *
 * Run with: npm run migrate:employees
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: join(__dirname, '..', '.env.local') });

// Firebase configuration (from .env.local)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Firebase configuration not found!');
  console.error('   Make sure .env.local file exists with Firebase credentials.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type EmployeeLevel = 'executive' | 'department_head' | 'manager' | 'ic';
type EmploymentType = 'W2' | 'Contractor' | 'Trial' | 'International';
type LocationType = 'On-Site' | 'Remote' | 'International';
type Department = 'management' | 'sales' | 'production' | 'generative' | 'community' | 'platform';

interface EmployeeData {
  email: string;
  name: string;
  title: string;
  department: Department;
  reportsTo: string | null;
  level: EmployeeLevel;
  employmentType: EmploymentType;
  location: LocationType;
  isActive: boolean;
}

// Email domain for Kartel AI
const EMAIL_DOMAIN = '@kartel.ai';

// Helper function to generate email from name (first name only)
function generateEmail(name: string): string {
  return name.split(' ')[0].toLowerCase() + EMAIL_DOMAIN;
}

// All 22 Kartel AI employees
const employees: EmployeeData[] = [
  // Executive Team
  {
    email: generateEmail('Kevin Reilly'),
    name: 'Kevin Reilly',
    title: 'CEO',
    department: 'management',
    reportsTo: null, // Reports to Board
    level: 'executive',
    employmentType: 'W2',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Luke Peterson'),
    name: 'Luke Peterson',
    title: 'President & Co-Founder',
    department: 'management',
    reportsTo: null, // Reports to Board
    level: 'executive',
    employmentType: 'W2',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Ben Kusin'),
    name: 'Ben Kusin',
    title: 'CRO & Co-Founder',
    department: 'sales',
    reportsTo: 'kevin.reilly@kartel.ai',
    level: 'department_head',
    employmentType: 'W2',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Jerry Bellman'),
    name: 'Jerry Bellman',
    title: 'CFO (Part-Time)',
    department: 'management',
    reportsTo: 'kevin.reilly@kartel.ai',
    level: 'executive',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },

  // Department Heads
  {
    email: generateEmail('Wayan Palmieri'),
    name: 'Wayan Palmieri',
    title: 'SVP, Head of Production',
    department: 'production',
    reportsTo: 'luke.peterson@kartel.ai',
    level: 'department_head',
    employmentType: 'Contractor',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Fill Isgro'),
    name: 'Fill Isgro',
    title: 'SVP, Head of Generative Engineering',
    department: 'generative',
    reportsTo: 'luke.peterson@kartel.ai',
    level: 'department_head',
    employmentType: 'W2',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Daniel Kalotov'),
    name: 'Daniel Kalotov',
    title: 'SVP, Head of Community & Partnerships',
    department: 'community',
    reportsTo: 'luke.peterson@kartel.ai',
    level: 'department_head',
    employmentType: 'W2',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Niels Hoffmann'),
    name: 'Niels Hoffmann',
    title: 'CTO',
    department: 'platform',
    reportsTo: 'luke.peterson@kartel.ai',
    level: 'department_head',
    employmentType: 'International',
    location: 'International',
    isActive: true,
  },

  // Sales Department
  {
    email: generateEmail('Emmet Reilly'),
    name: 'Emmet Reilly',
    title: 'Director of Customer Success',
    department: 'sales',
    reportsTo: 'ben.kusin@kartel.ai',
    level: 'manager',
    employmentType: 'W2',
    location: 'Remote',
    isActive: true,
  },

  // Production Department
  {
    email: generateEmail('Veronica Diaz'),
    name: 'Veronica Diaz',
    title: 'Production Manager',
    department: 'production',
    reportsTo: 'wayan.palmieri@kartel.ai',
    level: 'manager',
    employmentType: 'Trial',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Estefania Guarderas'),
    name: 'Estefania Guarderas',
    title: 'Producer',
    department: 'production',
    reportsTo: 'wayan.palmieri@kartel.ai',
    level: 'ic',
    employmentType: 'W2',
    location: 'Remote',
    isActive: true,
  },
  {
    email: generateEmail('Jason Goldwatch'),
    name: 'Jason Goldwatch',
    title: 'Director',
    department: 'production',
    reportsTo: 'wayan.palmieri@kartel.ai',
    level: 'manager',
    employmentType: 'Contractor',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Noah Shields'),
    name: 'Noah Shields',
    title: 'Associate Producer',
    department: 'production',
    reportsTo: 'veronica.diaz@kartel.ai',
    level: 'ic',
    employmentType: 'W2',
    location: 'On-Site',
    isActive: true,
  },

  // Generative Department
  {
    email: generateEmail('Brandon Valedez'),
    name: 'Brandon Valedez',
    title: 'Data Training / LoRA Models',
    department: 'generative',
    reportsTo: 'fill.isgro@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },
  {
    email: generateEmail('Sean Geisterfer'),
    name: 'Sean Geisterfer',
    title: 'Data Engineering',
    department: 'generative',
    reportsTo: 'fill.isgro@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'On-Site',
    isActive: true,
  },
  {
    email: generateEmail('Trent Hunter'),
    name: 'Trent Hunter',
    title: 'Workflow Engineer',
    department: 'generative',
    reportsTo: 'fill.isgro@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },
  {
    email: generateEmail('Elliot Quartz'),
    name: 'Elliot Quartz',
    title: 'AI Generalist',
    department: 'generative',
    reportsTo: 'fill.isgro@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },
  {
    email: generateEmail('Marc Donhue'),
    name: 'Marc Donhue',
    title: 'Preditor',
    department: 'generative',
    reportsTo: 'fill.isgro@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },
  {
    email: generateEmail('Ahmed Yakout'),
    name: 'Ahmed Yakout',
    title: 'Workflow Engineer - Real Estate',
    department: 'generative',
    reportsTo: 'fill.isgro@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },

  // Platform Department
  {
    email: generateEmail('Matthias Thoemmes'),
    name: 'Matthias Thoemmes',
    title: 'Full Stack Developer',
    department: 'platform',
    reportsTo: 'niels.hoffmann@kartel.ai',
    level: 'ic',
    employmentType: 'International',
    location: 'International',
    isActive: true,
  },
  {
    email: generateEmail('Lukas Motiejunas'),
    name: 'Lukas Motiejunas',
    title: 'Full Stack Developer',
    department: 'platform',
    reportsTo: 'niels.hoffmann@kartel.ai',
    level: 'ic',
    employmentType: 'International',
    location: 'International',
    isActive: true,
  },
  {
    email: generateEmail('Zac Bagley'),
    name: 'Zac Bagley',
    title: 'Backend Engineer',
    department: 'platform',
    reportsTo: 'niels.hoffmann@kartel.ai',
    level: 'ic',
    employmentType: 'Trial',
    location: 'Remote',
    isActive: true,
  },
];

async function migrateEmployees() {
  console.log('🚀 Starting employee data migration...\n');

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const employee of employees) {
      try {
        // Use email as document ID for easy lookup
        const employeeDocRef = doc(db, 'employees', employee.email);

        // Add timestamps
        const employeeData = {
          ...employee,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await setDoc(employeeDocRef, employeeData);

        console.log(`✅ ${employee.name} (${employee.email})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add ${employee.name}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount} employees`);
    console.log(`   ❌ Failed: ${errorCount} employees`);
    console.log(`   📈 Total: ${employees.length} employees`);

    if (successCount === employees.length) {
      console.log('\n🎉 All employees successfully migrated to Firestore!');
      console.log('\n📝 Next steps:');
      console.log('   1. You can now sign in with any @kartel.ai email');
      console.log('   2. Test the login at http://localhost:5173/');
      console.log('   3. Users will be matched by their email address');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the migration
migrateEmployees();
