import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

async function validateData(): Promise<ValidationResult> {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  console.log('🔍 Starting data validation...\n');

  try {
    // 1. Validate employee count
    console.log('👥 Validating employees...');
    const employeesSnapshot = await db.collection('employees').get();
    const employeeCount = employeesSnapshot.size;

    console.log(`   Found ${employeeCount} employees`);

    if (employeeCount !== 22) {
      result.errors.push(`Expected 22 employees, found ${employeeCount}`);
      result.passed = false;
    } else {
      console.log('   ✅ Employee count correct (22)');
    }

    // 2. Validate employee role references match employees
    console.log('\n📇 Validating employee role references...');
    const roleRefsSnapshot = await db.collection('employeeRoleReferences').get();
    const roleRefCount = roleRefsSnapshot.size;

    console.log(`   Found ${roleRefCount} role references`);

    if (roleRefCount !== employeeCount) {
      result.errors.push(`Employee count (${employeeCount}) doesn't match role reference count (${roleRefCount})`);
      result.passed = false;
    } else {
      console.log('   ✅ Role reference count matches employee count');
    }

    // 3. Check for email format consistency
    console.log('\n📧 Validating email formats...');
    const emailSet = new Set<string>();
    let duplicateCount = 0;
    let invalidFormatCount = 0;

    employeesSnapshot.docs.forEach(doc => {
      const email = doc.id;

      // Check for duplicates
      if (emailSet.has(email)) {
        duplicateCount++;
        result.errors.push(`Duplicate employee email: ${email}`);
      }
      emailSet.add(email);

      // Check email format (should be firstname@kartel.ai)
      if (!email.match(/^[a-z]+(\.[a-z]+)?@kartel\.ai$/)) {
        invalidFormatCount++;
        result.warnings.push(`Unusual email format: ${email}`);
      }
    });

    if (duplicateCount > 0) {
      result.passed = false;
      console.log(`   ❌ Found ${duplicateCount} duplicate emails`);
    } else {
      console.log('   ✅ No duplicate emails');
    }

    if (invalidFormatCount > 0) {
      console.log(`   ⚠️  Found ${invalidFormatCount} emails with unusual format`);
    } else {
      console.log('   ✅ All emails follow standard format');
    }

    // 4. Validate WhyGOs
    console.log('\n🎯 Validating WhyGOs...');
    const whygosSnapshot = await db.collection('whygos').get();
    const whygoCount = whygosSnapshot.size;

    console.log(`   Found ${whygoCount} WhyGOs`);

    // Count by level
    let companyCount = 0;
    let departmentCount = 0;
    let individualCount = 0;

    for (const doc of whygosSnapshot.docs) {
      const data = doc.data();
      if (data.level === 'company') companyCount++;
      else if (data.level === 'department') departmentCount++;
      else if (data.level === 'individual') individualCount++;
    }

    console.log(`   - Company: ${companyCount}`);
    console.log(`   - Department: ${departmentCount}`);
    console.log(`   - Individual: ${individualCount}`);

    // 5. Validate WhyGO owner foreign keys
    console.log('\n🔗 Validating WhyGO owner references...');
    let brokenOwnerRefs = 0;

    for (const doc of whygosSnapshot.docs) {
      const data = doc.data();
      const ownerId = data.ownerId;

      if (ownerId && !emailSet.has(ownerId)) {
        brokenOwnerRefs++;
        result.errors.push(`WhyGO ${doc.id} has invalid ownerId: ${ownerId}`);
      }
    }

    if (brokenOwnerRefs > 0) {
      result.passed = false;
      console.log(`   ❌ Found ${brokenOwnerRefs} WhyGOs with invalid owner references`);
    } else {
      console.log('   ✅ All WhyGO owners reference valid employees');
    }

    // 6. Validate outcomes
    console.log('\n📊 Validating outcomes...');
    let totalOutcomes = 0;
    let brokenOutcomeOwnerRefs = 0;
    let invalidTargets = 0;

    for (const whygoDoc of whygosSnapshot.docs) {
      const outcomesSnapshot = await whygoDoc.ref.collection('outcomes').get();
      totalOutcomes += outcomesSnapshot.size;

      for (const outcomeDoc of outcomesSnapshot.docs) {
        const outcome = outcomeDoc.data();

        // Check owner reference
        if (outcome.ownerId && !emailSet.has(outcome.ownerId)) {
          brokenOutcomeOwnerRefs++;
          result.errors.push(`Outcome ${outcomeDoc.id} has invalid ownerId: ${outcome.ownerId}`);
        }

        // Check quarterly targets sum to annual (±1% tolerance)
        const quarterlySum = (outcome.q1Target || 0) + (outcome.q2Target || 0) + (outcome.q3Target || 0) + (outcome.q4Target || 0);
        const annual = outcome.annualTarget || 0;

        if (annual > 0) {
          const percentDiff = Math.abs(quarterlySum - annual) / annual;
          if (percentDiff > 0.01) {
            invalidTargets++;
            result.warnings.push(`Outcome ${outcomeDoc.id} quarterly targets (${quarterlySum}) don't match annual (${annual})`);
          }
        }
      }
    }

    console.log(`   Found ${totalOutcomes} total outcomes`);

    if (brokenOutcomeOwnerRefs > 0) {
      result.passed = false;
      console.log(`   ❌ Found ${brokenOutcomeOwnerRefs} outcomes with invalid owner references`);
    } else {
      console.log('   ✅ All outcome owners reference valid employees');
    }

    if (invalidTargets > 0) {
      console.log(`   ⚠️  Found ${invalidTargets} outcomes with quarterly targets that don't sum to annual`);
    } else {
      console.log('   ✅ All quarterly targets sum correctly');
    }

    // 7. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Employees: ${employeeCount}`);
    console.log(`Role References: ${roleRefCount}`);
    console.log(`WhyGOs: ${whygoCount} (Company: ${companyCount}, Department: ${departmentCount}, Individual: ${individualCount})`);
    console.log(`Outcomes: ${totalOutcomes}`);
    console.log('\nErrors: ' + (result.errors.length === 0 ? '✅ None' : `❌ ${result.errors.length}`));
    console.log('Warnings: ' + (result.warnings.length === 0 ? '✅ None' : `⚠️  ${result.warnings.length}`));

    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      result.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      result.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }

    console.log('\n' + '='.repeat(60));

    if (result.passed) {
      console.log('✅ ALL VALIDATION CHECKS PASSED!\n');
    } else {
      console.log('❌ VALIDATION FAILED - Please fix errors above\n');
    }

  } catch (error) {
    console.error('❌ Validation error:', error);
    result.passed = false;
    result.errors.push(`Validation script error: ${error}`);
  }

  return result;
}

// Run validation
validateData()
  .then((result) => {
    process.exit(result.passed ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
