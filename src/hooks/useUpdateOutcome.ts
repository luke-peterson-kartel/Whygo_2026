import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { PermissionService } from '@/lib/utils/permissions';
import type { Outcome, StatusIndicator } from '@/types/whygo.types';

interface UpdateOutcomeParams {
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  actual?: string | number | null;
  status?: StatusIndicator;
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
    // Validate permission
    if (!user || !PermissionService.canUpdateProgress(user, outcome)) {
      return { success: false, error: 'Permission denied' };
    }

    // Build update object with only defined values
    const updateData: Record<string, any> = {
      updatedBy: user.firebaseUid || user.id,
      updatedAt: serverTimestamp(),
    };

    // Only include actual if it's provided (allows explicit null)
    if (updates.actual !== undefined) {
      updateData[`${updates.quarter}Actual`] = updates.actual;
    }

    // Only include status if it's provided
    if (updates.status !== undefined) {
      updateData[`${updates.quarter}Status`] = updates.status;
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
