# WhyGO Migration Guide

This guide explains how to migrate WhyGO data from markdown files into Firestore.

## Prerequisites

Before running the migration, you need:

1. **Firebase Service Account Key**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the downloaded JSON file as `firebase-service-account.json` in the root directory
   - **IMPORTANT:** This file contains sensitive credentials and is already in `.gitignore`

2. **Node Modules Installed**
   ```bash
   npm install
   ```

## Migration Steps

### 1. Employee Migration (Already Completed)

The employee data has been migrated from `EMPLOYEE_REFERENCE.md`:

```bash
npm run migrate:employees
```

This created 22 employee records with correct email format: `firstname@kartel.ai`

### 2. WhyGO Migration

Migrate all Company and Department WhyGOs from markdown files:

```bash
npm run migrate:whygos
```

This will:
- Parse `Kartel_AI_Company_WhyGO__2026(Final).md` (4 company WhyGOs)
- Parse all 5 department WhyGO files (Sales, Production, Platform, Generative, Community)
- Extract WHY, GOAL, and OUTCOMES from each
- Create Firestore documents in `whygos` collection
- Create outcomes as subcollections under each WhyGO

### Expected Output

```
🚀 Starting WhyGO migration...

📊 Migrating Company WhyGOs...
   Processing: Kartel_AI_Company_WhyGO__2026(Final).md
   ✓ WhyGO: Onboard 10 enterprise clients across 5 key verticals...
      → Outcome 1: Enterprise clients signed (total)
      → Outcome 2: Verticals with 2+ clients
      → Outcome 3: Revenue closed
      → Outcome 4: Client case studies published
   ✓ WhyGO: Establish operational infrastructure...
   ...
   ✓ Imported 4 WhyGOs with 12 outcomes

📊 Migrating Department WhyGOs...
   Processing: Sales_Department_WhyGOs__2026(Final).md
   ...

✅ Migration complete!
   Total WhyGOs: 19
   Total Outcomes: ~57
```

## Firestore Structure

After migration, your Firestore will have:

### Collection: `whygos`

Each WhyGO document contains:
- `id`: Generated unique ID (e.g., `cg_26_a7f3`)
- `level`: 'company' | 'department' | 'individual'
- `year`: 2026
- `department`: Sales, Production, etc. (null for company)
- `ownerId`: Owner email (e.g., `kevin@kartel.ai`)
- `ownerName`: Full name
- `why`: Strategic context (WHY statement)
- `goal`: Goal statement
- `status`: 'draft' | 'active'
- `parentWhyGOId`: null (to be set manually for alignment)
- `createdAt`, `updatedAt`: Timestamps
- `metadata`: Source file info

### Subcollection: `whygos/{whygoId}/outcomes`

Each outcome document contains:
- `id`: Generated ID (e.g., `cg_26_a7f3_o1`)
- `description`: Outcome description
- `annualTarget`: Annual target value
- `unit`: 'USD' | 'percentage' | 'count' | 'text'
- `q1Target`, `q2Target`, `q3Target`, `q4Target`: Quarterly targets
- `q1Actual`, `q2Actual`, `q3Actual`, `q4Actual`: Null (to be filled)
- `q1Status`, `q2Status`, `q3Status`, `q4Status`: 'not_started'
- `ownerId`, `ownerName`: Outcome owner
- `sortOrder`: Display order
- `createdAt`, `updatedAt`: Timestamps

## Viewing Migrated Data

After migration:

1. **In Firebase Console:**
   - Go to Firestore Database
   - Browse `whygos` collection
   - Click any WhyGO to see its `outcomes` subcollection

2. **In the App:**
   - Navigate to http://localhost:5173/company
   - View all Company WhyGOs with their outcomes
   - See quarterly tracking grids for each outcome

## Troubleshooting

### Error: "firebase-service-account.json not found"

**Solution:** Download the service account key from Firebase Console and save it as `firebase-service-account.json` in the project root.

### Error: "Permission denied"

**Solution:** Ensure your Firestore security rules allow writes. For development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### WhyGOs not appearing in app

**Solution:**
1. Check Firestore Console to verify documents were created
2. Check browser console for errors
3. Verify Firebase config in `.env.local`
4. Ensure you're logged in with a `@kartel.ai` account

## Next Steps

After migration:

1. **Set Parent WhyGO Relationships**
   - Manually link department WhyGOs to their parent company WhyGOs
   - Update `parentWhyGOId` field in Firestore Console

2. **Review and Approve**
   - Change status from 'draft' to 'active' once approved
   - Add `approvedBy` array with approver emails

3. **Start Tracking Progress**
   - Navigate to Progress Update pages
   - Input quarterly actuals
   - Watch status indicators auto-calculate

4. **Create Individual WhyGOs**
   - Use Goal Creation workflow
   - Link to department WhyGOs for alignment
   - Set quarterly targets

## Data Integrity Checks

Run these checks after migration:

```bash
# Count company WhyGOs (should be 4)
# Count department WhyGOs (should be ~15)
# Verify all outcomes have quarterly targets
# Verify all owner emails match employee records
```

Use Firestore Console queries or create a validation script.
