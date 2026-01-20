import { useState } from 'react';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { generateWhyGOId, generateOutcomeId } from '@/lib/utils/idGenerator';
import { validateWhyGOForm, WhyGOFormData, OutcomeFormData } from '@/lib/utils/validation';
import { PermissionService } from '@/lib/utils/permissions';
import { User } from '@/types/auth.types';

export interface UseCreateWhyGOReturn {
  createWhyGO: (formData: WhyGOFormData, user: User) => Promise<CreateWhyGOResult>;
  creating: boolean;
}

export interface CreateWhyGOResult {
  success: boolean;
  whygoId?: string;
  error?: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

/**
 * Hook to create a new WhyGO with outcomes using atomic batch write
 */
export function useCreateWhyGO(): UseCreateWhyGOReturn {
  const [creating, setCreating] = useState(false);

  const createWhyGO = async (
    formData: WhyGOFormData,
    user: User
  ): Promise<CreateWhyGOResult> => {
    setCreating(true);

    try {
      // Validate form data
      const validationErrors = validateWhyGOForm(formData);
      if (validationErrors.length > 0) {
        setCreating(false);
        return {
          success: false,
          validationErrors,
          error: 'Please fix validation errors before submitting',
        };
      }

      // Check permissions
      if (!PermissionService.canCreateWhyGO(user as any, formData.level)) {
        setCreating(false);
        return {
          success: false,
          error: `You don't have permission to create ${formData.level}-level WhyGOs`,
        };
      }

      // Generate WhyGO ID
      const whygoId = generateWhyGOId({
        level: formData.level,
        department: formData.department || undefined,
        year: 2026,
      });

      // Create batch write
      const batch = writeBatch(db);

      // Prepare WhyGO document
      const whygoDoc = {
        goal: formData.goal.trim(),
        why: formData.why.trim(),
        level: formData.level,
        department: formData.department,
        year: 2026,
        status: 'active',
        ownerId: user.email,
        ownerName: user.name,
        parentWhyGOId: formData.parentWhyGOId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.email,
      };

      // Write WhyGO document
      const whygoRef = doc(db, 'whygos', whygoId);
      batch.set(whygoRef, whygoDoc);

      // Write each outcome as subcollection document
      formData.outcomes.forEach((outcome: OutcomeFormData, index: number) => {
        const outcomeId = generateOutcomeId(whygoId, index + 1);
        const outcomeDoc = {
          description: outcome.description.trim(),
          annualTarget: parseNumericValue(outcome.annualTarget),
          unit: outcome.unit,
          q1Target: parseNumericValue(outcome.q1Target),
          q2Target: parseNumericValue(outcome.q2Target),
          q3Target: parseNumericValue(outcome.q3Target),
          q4Target: parseNumericValue(outcome.q4Target),
          q1Actual: null,
          q2Actual: null,
          q3Actual: null,
          q4Actual: null,
          q1Status: null,
          q2Status: null,
          q3Status: null,
          q4Status: null,
          ownerId: outcome.ownerId,
          ownerName: outcome.ownerName,
          sortOrder: index + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const outcomeRef = doc(db, 'whygos', whygoId, 'outcomes', outcomeId);
        batch.set(outcomeRef, outcomeDoc);
      });

      // Commit batch atomically
      await batch.commit();

      setCreating(false);
      return {
        success: true,
        whygoId,
      };
    } catch (err) {
      console.error('Error creating WhyGO:', err);
      setCreating(false);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create WhyGO. Please try again.',
      };
    }
  };

  return {
    createWhyGO,
    creating,
  };
}

/**
 * Parses a numeric value from string or number
 */
function parseNumericValue(value: number | string | null | undefined): number | string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return '';
    }
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? trimmed : parsed;
  }

  return '';
}
