import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { parse } from 'csv-parse/sync';
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

interface EmployeeCSVRow {
  Name: string;
  Email: string;
  Title: string;
  Department: string;
  'Reports To': string;
  Level: string;
  'WhyGO Alignment': string;
  'Job Description': string;
  'Core Responsibilities': string;
  'Suggested KPIs (WhyGO-Aligned)': string;
}

interface SuggestedKPI {
  metric: string;
  target: string;
  alignsTo: string;
}

/**
 * Parse KPI text into structured format
 * Example: "Revenue Growth: $50M ARR (aligns with Company WhyGO #1)"
 */
function parseKPIText(kpiText: string): SuggestedKPI[] {
  if (!kpiText || kpiText.trim() === '') return [];

  const kpis: SuggestedKPI[] = [];
  const lines = kpiText.split('\n').filter(line => line.trim() !== '');

  for (const line of lines) {
    // Match pattern: "Metric: Target (aligns with ...)"
    const match = line.match(/^(.+?):\s*(.+?)\s*\(aligns\s+with\s+(.+?)\)$/i);

    if (match) {
      kpis.push({
        metric: match[1].trim(),
        target: match[2].trim(),
        alignsTo: match[3].trim(),
      });
    } else {
      // Fallback: treat as metric without alignment
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        kpis.push({
          metric: line.substring(0, colonIndex).trim(),
          target: line.substring(colonIndex + 1).trim(),
          alignsTo: 'General',
        });
      }
    }
  }

  return kpis;
}

/**
 * Parse core responsibilities into array
 */
function parseResponsibilities(text: string): string[] {
  if (!text || text.trim() === '') return [];

  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '' && line !== '-')
    .map(line => line.replace(/^[-•]\s*/, '')); // Remove bullet points
}

/**
 * Normalize level field to match Firestore enum
 */
function normalizeLevel(level: string): 'executive' | 'department_head' | 'manager' | 'ic' {
  const normalized = level.toLowerCase().trim();

  if (normalized === 'executive' || normalized === 'exec') return 'executive';
  if (normalized === 'department_head' || normalized === 'department head' || normalized === 'dept head') return 'department_head';
  if (normalized === 'manager' || normalized === 'mgr') return 'manager';
  return 'ic';
}

async function migrateEmployeesFromCSV() {
  try {
    console.log('🚀 Starting employee migration from CSV...\n');

    // Read CSV file
    const csvPath = path.join(__dirname, '../employees_2026 (job, roll, reports).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Parse CSV
    console.log('📄 Parsing CSV file...');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as EmployeeCSVRow[];

    console.log(`   Found ${records.length} employees in CSV\n`);

    // Migrate each employee
    console.log('👥 Migrating employees to Firestore...');
    let employeeCount = 0;
    let roleRefCount = 0;

    for (const row of records) {
      const email = row.Email.toLowerCase().trim();

      // Create employee document
      const employeeData = {
        name: row.Name,
        email: email,
        title: row.Title,
        department: row.Department,
        reportsTo: row['Reports To'] || null,
        level: normalizeLevel(row.Level),
        employmentType: 'Full-time', // Default value
        location: '', // Default value
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('employees').doc(email).set(employeeData);
      employeeCount++;

      // Create employee role reference document
      const roleReferenceData = {
        id: email,
        title: row.Title,
        department: row.Department,
        reportsTo: row['Reports To'] || null,
        whygoAlignment: row['WhyGO Alignment']
          ? row['WhyGO Alignment'].split(',').map(s => s.trim())
          : [],
        jobDescription: row['Job Description'] || '',
        coreResponsibilities: parseResponsibilities(row['Core Responsibilities']),
        suggestedKPIs: parseKPIText(row['Suggested KPIs (WhyGO-Aligned)']),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('employeeRoleReferences').doc(email).set(roleReferenceData);
      roleRefCount++;

      if (employeeCount % 5 === 0) {
        console.log(`   Migrated ${employeeCount} employees...`);
      }
    }

    console.log('\n✅ Migration complete!');
    console.log(`   Employees created: ${employeeCount}`);
    console.log(`   Role references created: ${roleRefCount}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateEmployeesFromCSV();
