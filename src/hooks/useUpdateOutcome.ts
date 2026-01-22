import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { PermissionService } from '@/lib/utils/permissions';
import type { Outcome, StatusIndicator } from '@/types/whygo.types';

interface UpdateOutcomeParams {
  quarter?: 'q1' | 'q2' | 'q3' | 'q4';
  actual?: string | number | null;
  status?: StatusIndicator;
  // New fields for outcome details editing
  description?: string;
  annualTarget?: number;
  unit?: string;
  q1Target?: number;
  q2Target?: number;
  q3Target?: number;
  q4Target?: number;
}

interface UpdateOutcomeResult {
  success: boolean;
  error?: string;
}

export function useUpdateOutcome() {
  const { user } = useAuth();

  const updateOutcome = async (
    whygoId: string,
    outcome: Outcome,
    updates: UpdateOutcomeParams
  ): Promise<UpdateOutcomeResult> => {
    // Check if updating details (requires higher permission) or just progress
    const isUpdatingDetails = !!(
      updates.description !== undefined ||
      updates.annualTarget !== undefined ||
      updates.unit !== undefined ||
      updates.q1Target !== undefined ||
      updates.q2Target !== undefined ||
      updates.q3Target !== undefined ||
      updates.q4Target !== undefined
    );

    // Validate permission
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (isUpdatingDetails && !PermissionService.canEditOutcomeDetails(user)) {
      return { success: false, error: 'Only executives and department heads can edit outcome details' };
    }

    if (!isUpdatingDetails && !PermissionService.canUpdateProgress(user, outcome)) {
      return { success: false, error: 'Permission denied' };
    }

    // Build update object with only defined values
    const updateData: Record<string, any> = {
      updatedBy: user.firebaseUid || user.id,
      updatedAt: serverTimestamp(),
    };

    // Outcome details updates
    if (updates.description !== undefined) {
      updateData.description = updates.description;
    }
    if (updates.annualTarget !== undefined) {
      updateData.annualTarget = updates.annualTarget;
    }
    if (updates.unit !== undefined) {
      updateData.unit = updates.unit;
    }
    if (updates.q1Target !== undefined) {
      updateData.q1Target = updates.q1Target;
    }
    if (updates.q2Target !== undefined) {
      updateData.q2Target = updates.q2Target;
    }
    if (updates.q3Target !== undefined) {
      updateData.q3Target = updates.q3Target;
    }
    if (updates.q4Target !== undefined) {
      updateData.q4Target = updates.q4Target;
    }

    // Quarterly progress updates
    if (updates.quarter) {
      // Only include actual if it's provided (allows explicit null)
      if (updates.actual !== undefined) {
        updateData[`${updates.quarter}Actual`] = updates.actual;
      }

      // Only include status if it's provided
      if (updates.status !== undefined) {
        updateData[`${updates.quarter}Status`] = updates.status;
      }
    }

    // Update Firebase
    try {
      const outcomeRef = doc(
        db,
        'whygos',
        whygoId,
        'outcomes',
        outcome.id
      );
      await updateDoc(outcomeRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('[useUpdateOutcome] Firebase update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed'
      };
    }
  };

  return { updateOutcome };
}
