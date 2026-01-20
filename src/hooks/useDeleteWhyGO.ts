import { useState } from 'react';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PermissionService } from '@/lib/utils/permissions';
import { WhyGO } from '@/types/whygo.types';
import { User } from '@/types/auth.types';

export interface UseDeleteWhyGOReturn {
  deleteWhyGO: (whygo: WhyGO, user: User) => Promise<DeleteWhyGOResult>;
  deleting: boolean;
}

export interface DeleteWhyGOResult {
  success: boolean;
  error?: string;
}

export function useDeleteWhyGO(): UseDeleteWhyGOReturn {
  const [deleting, setDeleting] = useState(false);

  const deleteWhyGO = async (
    whygo: WhyGO,
    user: User
  ): Promise<DeleteWhyGOResult> => {
    setDeleting(true);

    try {
      // Check permissions
      if (!PermissionService.canDeleteWhyGO(user as any, whygo)) {
        setDeleting(false);
        return {
          success: false,
          error: "You don't have permission to delete this WhyGO",
        };
      }

      // Delete all outcomes first (subcollection)
      const outcomesRef = collection(db, 'whygos', whygo.id, 'outcomes');
      const outcomesSnapshot = await getDocs(outcomesRef);

      for (const outcomeDoc of outcomesSnapshot.docs) {
        await deleteDoc(doc(db, 'whygos', whygo.id, 'outcomes', outcomeDoc.id));
      }

      // Delete the parent WhyGO
      await deleteDoc(doc(db, 'whygos', whygo.id));

      setDeleting(false);
      return { success: true };
    } catch (err) {
      console.error('Error deleting WhyGO:', err);
      setDeleting(false);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete WhyGO',
      };
    }
  };

  return {
    deleteWhyGO,
    deleting,
  };
}
