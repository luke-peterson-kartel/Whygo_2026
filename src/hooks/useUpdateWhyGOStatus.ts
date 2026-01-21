import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WhyGOStatus } from '@/types/whygo.types';
import { useDevMode } from './useDevMode';
import { PermissionService } from '@/lib/utils/permissions';

interface UpdateStatusOptions {
  whygoId: string;
  newStatus: WhyGOStatus;
  whygoLevel: 'company' | 'department' | 'individual';
  whygoDepartment?: string | null;
}

export function useUpdateWhyGOStatus() {
  const { user } = useDevMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async ({ whygoId, newStatus, whygoLevel, whygoDepartment }: UpdateStatusOptions) => {
    if (!user) {
      setError('You must be logged in to update WhyGO status');
      return { success: false };
    }

    // Permission check:
    // - Executives can change status for ALL WhyGOs
    // - Department heads can change status for their own department's WhyGOs
    const isExecutive = user.level === 'executive';
    const isDepartmentHead = user.level === 'department_head';
    const isOwnDepartment = isDepartmentHead && whygoLevel === 'department' && user.department === whygoDepartment;

    if (!isExecutive && !isOwnDepartment) {
      setError(isDepartmentHead
        ? 'Department heads can only change status for their own department\'s WhyGOs'
        : 'Only executives and department heads can change WhyGO status'
      );
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);

      const whygoRef = doc(db, 'whygos', whygoId);
      const updateData: any = {
        status: newStatus,
        updatedAt: serverTimestamp(),
      };

      // If activating from draft, set approval metadata
      if (newStatus === 'active') {
        updateData.approvedBy = user.email;
        updateData.approvedByName = user.name;
        updateData.approvedAt = serverTimestamp();
      }

      await updateDoc(whygoRef, updateData);

      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update WhyGO status';
      setError(errorMessage);
      setLoading(false);
      return { success: false };
    }
  };

  return {
    updateStatus,
    loading,
    error,
  };
}
