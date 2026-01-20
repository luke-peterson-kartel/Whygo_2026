/**
 * Migration Script: Employee Role References
 *
 * Parses EMPLOYEE_REFERENCE_WITH_KPIS.md and creates employeeRoleReferences collection in Firestore
 *
 * Run with: npx tsx scripts/migrate-employee-role-references.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

interface SuggestedKPI {
  metric: string;
  target: string;
  alignsTo: string;
  quarterlyBreakdown?: {
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
  };
}

interface EmployeeRoleReference {
  id: string;
  title: string;
  department: string;
  reportsTo: string;
  whygoAlignment: string[];
  jobDescription: string;
  coreResponsibilities: string[];
  suggestedKPIs: SuggestedKPI[];
}

/**
 * Parse the markdown file and extract employee data
 */
function parseMarkdownFile(filePath: string): EmployeeRoleReference[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const employees: EmployeeRoleReference[] = [];

  // Split by employee sections (marked by ### Name)
  const sections = content.split(/^### /m).filter(Boolean);

  for (const section of sections) {
    try {
      const employee = parseEmployeeSection(section);
      if (employee) {
        employees.push(employee);
      }
    } catch (err) {
      console.error('Error parsing section:', err);
    }
  }

  return employees;
}

/**
 * Parse a single employee section
 */
function parseEmployeeSection(section: string): EmployeeRoleReference | null {
  const lines = section.split('\n');
  const nameMatch = lines[0].match(/^(.+?)$/);
  if (!nameMatch) return null;

  const name = nameMatch[1].trim();

  // Extract metadata from bullet points
  let title = '';
  let department = '';
  let reportsTo = '';
  let whygoAlignment: string[] = [];

  for (const line of lines) {
    if (line.startsWith('- **Title:**')) {
      title = line.replace('- **Title:**', '').trim();
    } else if (line.startsWith('- **Department:**')) {
      department = line.replace('- **Department:**', '').trim();
    } else if (line.startsWith('- **Reports To:**')) {
      reportsTo = line.replace('- **Reports To:**', '').trim();
    } else if (line.startsWith('- **WhyGO Alignment:**')) {
      const alignmentText = line.replace('- **WhyGO Alignment:**', '').trim();
      // Parse patterns like "Company WhyGO #1 (Primary)" or "Company WhyGOs #1-4"
      whygoAlignment = extractWhyGOAlignment(alignmentText);
    }
  }

  // Extract job description
  const jobDescMatch = section.match(/\*\*Job Description:\*\*\s*\n([\s\S]*?)\n\n/);
  const jobDescription = jobDescMatch ? jobDescMatch[1].trim() : '';

  // Extract core responsibilities
  const coreResponsibilities = extractListItems(section, '**Core Responsibilities:**');

  // Extract suggested KPIs
  const suggestedKPIs = extractKPIs(section);

  // Generate email ID
  const email = generateEmail(name);

  return {
    id: email,
    title,
    department,
    reportsTo,
    whygoAlignment,
    jobDescription,
    coreResponsibilities,
    suggestedKPIs,
  };
}

/**
 * Extract WhyGO alignment references
 */
function extractWhyGOAlignment(text: string): string[] {
  const alignments: string[] = [];

  // Match patterns like "#1", "#2", "#1-4"
  const singleMatch = text.match(/#(\d+)/g);
  if (singleMatch) {
    singleMatch.forEach((match) => {
      const num = match.replace('#', '');
      alignments.push(`Company WhyGO #${num}`);
    });
  }

  return alignments;
}

/**
 * Extract bullet list items
 */
function extractListItems(section: string, header: string): string[] {
  const items: string[] = [];
  const headerIndex = section.indexOf(header);
  if (headerIndex === -1) return items;

  const afterHeader = section.substring(headerIndex + header.length);
  const lines = afterHeader.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('-')) {
      items.push(line.trim().substring(1).trim());
    } else if (line.trim() === '' || line.trim().startsWith('**')) {
      break;
    }
  }

  return items;
}

/**
 * Extract KPIs from table format
 */
function extractKPIs(section: string): SuggestedKPI[] {
  const kpis: SuggestedKPI[] = [];

  // Look for tables (simple format: | Metric | Target |)
  const tableRegex = /\| Metric \| Target \|[\s\S]*?\n\n/g;
  const tables = section.match(tableRegex);

  if (tables) {
    for (const table of tables) {
      const rows = table.split('\n').filter((row) => row.includes('|') && !row.includes('Metric'));

      for (const row of rows) {
        const cells = row.split('|').map((cell) => cell.trim()).filter(Boolean);
        if (cells.length >= 2 && cells[0] !== '---') {
          kpis.push({
            metric: cells[0],
            target: cells[1],
            alignsTo: 'Company WhyGO',
          });
        }
      }
    }
  }

  // Look for quarterly breakdown tables (| Metric | Q1 | Q2 | Q3 | Q4 |)
  const quarterlyRegex = /\| Metric \| Q1 \| Q2 \| Q3 \| Q4 \|[\s\S]*?\n\n/g;
  const quarterlyTables = section.match(quarterlyRegex);

  if (quarterlyTables) {
    for (const table of quarterlyTables) {
      const rows = table.split('\n').filter((row) => row.includes('|') && !row.includes('Metric'));

      for (const row of rows) {
        const cells = row.split('|').map((cell) => cell.trim()).filter(Boolean);
        if (cells.length >= 5 && cells[0] !== '---') {
          kpis.push({
            metric: cells[0],
            target: `Q4: ${cells[4]}`,
            alignsTo: 'Company WhyGO',
            quarterlyBreakdown: {
              q1: cells[1],
              q2: cells[2],
              q3: cells[3],
              q4: cells[4],
            },
          });
        }
      }
    }
  }

  return kpis;
}

/**
 * Generate email from name
 */
function generateEmail(name: string): string {
  const nameParts = name.toLowerCase().split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0]}.${nameParts[1]}@kartel.ai`;
  }
  return `${nameParts[0]}@kartel.ai`;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting employee role reference migration...\n');

  const markdownPath = path.join(__dirname, '../Kartel Team/EMPLOYEE_REFERENCE_WITH_KPIS.md');

  if (!fs.existsSync(markdownPath)) {
    console.error('❌ Error: EMPLOYEE_REFERENCE_WITH_KPIS.md not found');
    process.exit(1);
  }

  const employees = parseMarkdownFile(markdownPath);
  console.log(`📄 Parsed ${employees.length} employees from markdown\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const employee of employees) {
    try {
      console.log(`📝 Migrating: ${employee.id} (${employee.title})`);

      const docRef = db.collection('employeeRoleReferences').doc(employee.id);
      await docRef.set({
        ...employee,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`   ✅ Success`);
      console.log(`   - Department: ${employee.department}`);
      console.log(`   - Reports To: ${employee.reportsTo}`);
      console.log(`   - Responsibilities: ${employee.coreResponsibilities.length}`);
      console.log(`   - KPIs: ${employee.suggestedKPIs.length}\n`);

      successCount++;
    } catch (err) {
      console.error(`   ❌ Error: ${err}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Migration complete!`);
  console.log(`   - Success: ${successCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log('='.repeat(50) + '\n');

  process.exit(0);
}

// Run migration
migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
