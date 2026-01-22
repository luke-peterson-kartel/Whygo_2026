import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';
import type { PipelineDeal } from '@/types/forecasting.types';

export interface UsePipelineDealsReturn {
  deals: PipelineDeal[];
  loading: boolean;
  error: string | null;
  addDeal: (deal: Omit<PipelineDeal, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDeal: (id: string, updates: Partial<Omit<PipelineDeal, 'id' | 'createdBy' | 'createdAt'>>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  refetch: () => void;
}

export function usePipelineDeals(): UsePipelineDealsReturn {
  const { user } = useAuth();
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to pipeline deals collection
  useEffect(() => {
    setLoading(true);
    setError(null);

    const dealsRef = collection(db, 'pipeline_deals');
    const q = query(dealsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedDeals: PipelineDeal[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PipelineDeal[];

        setDeals(loadedDeals);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading pipeline deals:', err);
        setError('Failed to load pipeline deals');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new deal
  const addDeal = useCallback(
    async (deal: Omit<PipelineDeal, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      if (!user) {
        throw new Error('You must be logged in to add a deal');
      }

      const dealsRef = collection(db, 'pipeline_deals');
      const docRef = await addDoc(dealsRef, {
        ...deal,
        createdBy: user.firebaseUid || user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    },
    [user]
  );

  // Update an existing deal
  const updateDeal = useCallback(
    async (id: string, updates: Partial<Omit<PipelineDeal, 'id' | 'createdBy' | 'createdAt'>>): Promise<void> => {
      if (!user) {
        throw new Error('You must be logged in to update a deal');
      }

      const dealRef = doc(db, 'pipeline_deals', id);
      await updateDoc(dealRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    },
    [user]
  );

  // Delete a deal
  const deleteDeal = useCallback(
    async (id: string): Promise<void> => {
      if (!user) {
        throw new Error('You must be logged in to delete a deal');
      }

      const dealRef = doc(db, 'pipeline_deals', id);
      await deleteDoc(dealRef);
    },
    [user]
  );

  // Manual refetch (though real-time subscription handles this automatically)
  const refetch = useCallback(() => {
    // With onSnapshot, data is real-time so this is a no-op
    // But we can trigger a re-render if needed
  }, []);

  return {
    deals,
    loading,
    error,
    addDeal,
    updateDeal,
    deleteDeal,
    refetch,
  };
}
