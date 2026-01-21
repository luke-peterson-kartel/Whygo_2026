import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { stringify } from 'csv-stringify/sync';
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

// Type definitions
interface WhyGO {
  id: string;
  level: 'company' | 'department';
  department: string | null;
  why: string;
  goal: string;
  ownerId: string;
  ownerName: string;
  status: string;
  approvedBy: string | null;
}

interface Outcome {
  id: string;
  description: string;
  annualTarget: number;
  unit: string;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
  ownerId: string;
  ownerName: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  reportsTo: string | null;
  level: string;
  employmentType?: string;
  location?: string;
}

interface WhyGORow {
  level: string;
  department: string;
  whygoId: string;
  ownerName: string;
  whyStatement: string;
  goalStatement: string;
  status: string;
  approvedBy: string;
  outcomeDescription: string;
  outcomeOwner: string;
  annualTarget: number;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
  unit: string;
}

interface EmployeeRow {
  name: string;
  email: string;
  title: string;
  department: string;
  reportsTo: string;
  level: string;
  employmentType: string;
  location: string;
}

async function exportWhyGOsAndEmployees() {
  try {
    console.log('🚀 Starting CSV export...\n');

    // Fetch all company and department WhyGOs for 2026
    console.log('📊 Fetching WhyGOs from Firestore...');
    const whygosSnapshot = await db.collection('whygos')
      .where('year', '==', 2026)
      .where('level', 'in', ['company', 'department'])
      .get();

    console.log(`   Found ${whygosSnapshot.size} WhyGOs\n`);

    // Fetch outcomes for each WhyGO
    console.log('🎯 Fetching outcomes...');
    const whygosWithOutcomes = await Promise.all(
      whygosSnapshot.docs.map(async (doc) => {
        const whygoData = { ...doc.data(), id: doc.id } as WhyGO;
        const outcomesSnapshot = await doc.ref.collection('outcomes').get();
        const outcomes = outcomesSnapshot.docs.map(o => ({ ...o.data(), id: o.id } as Outcome));

        return { whygo: whygoData, outcomes };
      })
    );

    const totalOutcomes = whygosWithOutcomes.reduce((sum, w) => sum + w.outcomes.length, 0);
    console.log(`   Found ${totalOutcomes} total outcomes\n`);

    // Fetch all employees
    console.log('👥 Fetching employees from Firestore...');
    const employeesSnapshot = await db.collection('employees').get();
    const employees = employeesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Employee));
    console.log(`   Found ${employees.length} employees\n`);

    // Transform WhyGOs to CSV rows (one row per outcome)
    console.log('🔄 Transforming WhyGO data...');
    const whygoRows: WhyGORow[] = whygosWithOutcomes.flatMap(({ whygo, outcomes }) =>
      outcomes.map(outcome => ({
        level: whygo.level === 'company' ? 'Company' : 'Department',
        department: whygo.department || '',
        whygoId: whygo.id,
        ownerName: whygo.ownerName,
        whyStatement: whygo.why,
        goalStatement: whygo.goal,
        status: whygo.status,
        approvedBy: whygo.approvedBy || '',
        outcomeDescription: outcome.description,
        outcomeOwner: outcome.ownerName,
        annualTarget: outcome.annualTarget,
        q1Target: outcome.q1Target,
        q2Target: outcome.q2Target,
        q3Target: outcome.q3Target,
        q4Target: outcome.q4Target,
        unit: outcome.unit
      }))
    );

    // Transform employees to CSV rows
    console.log('🔄 Transforming employee data...');
    const levelOrder: Record<string, number> = { executive: 0, department_head: 1, manager: 2, ic: 3 };

    const employeeRows: EmployeeRow[] = employees
      .sort((a, b) => {
        // Sort by department, then level, then name
        if (a.department !== b.department) return a.department.localeCompare(b.department);
        const levelA = levelOrder[a.level] ?? 999;
        const levelB = levelOrder[b.level] ?? 999;
        if (levelA !== levelB) return levelA - levelB;
        return a.name.localeCompare(b.name);
      })
      .map(emp => ({
        name: emp.name,
        email: emp.email,
        title: emp.title,
        department: emp.department,
        reportsTo: emp.reportsTo || 'N/A',
        level: emp.level,
        employmentType: emp.employmentType || 'Full-time',
        location: emp.location || ''
      }));

    // Generate CSV files
    console.log('📝 Generating CSV files...\n');

    const whygoCsv = stringify(whygoRows, {
      header: true,
      columns: [
        { key: 'level', header: 'Level' },
        { key: 'department', header: 'Department' },
        { key: 'whygoId', header: 'WhyGO ID' },
        { key: 'ownerName', header: 'WhyGO Owner' },
        { key: 'whyStatement', header: 'Why Statement' },
        { key: 'goalStatement', header: 'Goal Statement' },
        { key: 'status', header: 'Status' },
        { key: 'approvedBy', header: 'Approved By' },
        { key: 'outcomeDescription', header: 'Outcome Description' },
        { key: 'outcomeOwner', header: 'Outcome Owner' },
        { key: 'annualTarget', header: 'Annual Target' },
        { key: 'q1Target', header: 'Q1 Target' },
        { key: 'q2Target', header: 'Q2 Target' },
        { key: 'q3Target', header: 'Q3 Target' },
        { key: 'q4Target', header: 'Q4 Target' },
        { key: 'unit', header: 'Unit' }
      ]
    });

    const employeeCsv = stringify(employeeRows, {
      header: true,
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'title', header: 'Title' },
        { key: 'department', header: 'Department' },
        { key: 'reportsTo', header: 'Reports To' },
        { key: 'level', header: 'Level' },
        { key: 'employmentType', header: 'Employment Type' },
        { key: 'location', header: 'Location' }
      ]
    });

    // Write CSV files to project root
    const projectRoot = path.join(__dirname, '..');
    const whygoFilePath = path.join(projectRoot, 'whygos_export_2026.csv');
    const employeeFilePath = path.join(projectRoot, 'employees_export_2026.csv');

    fs.writeFileSync(whygoFilePath, whygoCsv, 'utf8');
    fs.writeFileSync(employeeFilePath, employeeCsv, 'utf8');

    // Success summary
    console.log('✅ Export complete!\n');
    console.log('📁 Files created:');
    console.log(`   - whygos_export_2026.csv (${whygoRows.length} rows)`);
    console.log(`   - employees_export_2026.csv (${employeeRows.length} rows)\n`);
    console.log('📊 Summary:');
    console.log(`   - ${whygosSnapshot.size} WhyGOs exported`);
    console.log(`   - ${totalOutcomes} outcomes exported`);
    console.log(`   - ${employees.length} employees exported\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

// Run the export
exportWhyGOsAndEmployees();
