import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PermissionService } from '@/lib/utils/permissions';
import { WhyGO } from '@/types/whygo.types';
import { User } from '@/types/auth.types';

export interface UseUpdateWhyGOReturn {
  updateWhyGO: (
    whygo: WhyGO,
    updates: { goal?: string; why?: string },
    user: User
  ) => Promise<UpdateWhyGOResult>;
  updating: boolean;
}

export interface UpdateWhyGOResult {
  success: boolean;
  error?: string;
}

export function useUpdateWhyGO(): UseUpdateWhyGOReturn {
  const [updating, setUpdating] = useState(false);

  const updateWhyGO = async (
    whygo: WhyGO,
    updates: { goal?: string; why?: string },
    user: User
  ): Promise<UpdateWhyGOResult> => {
    setUpdating(true);

    try {
      // Check permissions
      if (!PermissionService.canEditWhyGO(user as any, whygo)) {
        setUpdating(false);
        return {
          success: false,
          error: "You don't have permission to edit this WhyGO",
        };
      }

      // Validate inputs
      if (updates.goal && updates.goal.trim().length < 10) {
        setUpdating(false);
        return {
          success: false,
          error: 'Goal must be at least 10 characters',
        };
      }

      if (updates.why && updates.why.trim().length < 50) {
        setUpdating(false);
        return {
          success: false,
          error: 'Why statement must be at least 50 characters',
        };
      }

      // Update the WhyGO
      const whygoRef = doc(db, 'whygos', whygo.id);
      const updateData: any = {
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      };

      if (updates.goal) {
        updateData.goal = updates.goal.trim();
      }

      if (updates.why) {
        updateData.why = updates.why.trim();
      }

      await updateDoc(whygoRef, updateData);

      setUpdating(false);
      return { success: true };
    } catch (err) {
      console.error('Error updating WhyGO:', err);
      setUpdating(false);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update WhyGO',
      };
    }
  };

  return {
    updateWhyGO,
    updating,
  };
}
