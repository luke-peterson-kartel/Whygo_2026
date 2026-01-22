import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { WhyGOWithOutcomes } from '@/types/whygo.types';

interface UseWhyGOResult {
  whygo: WhyGOWithOutcomes | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useWhyGO(whygoId: string): UseWhyGOResult {
  const [whygo, setWhyGO] = useState<WhyGOWithOutcomes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWhyGO = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the WhyGO document
      const whygoRef = doc(db, 'whygos', whygoId);
      const whygoDoc = await getDoc(whygoRef);

      if (!whygoDoc.exists()) {
        throw new Error('WhyGO not found');
      }

      // Fetch the outcomes subcollection
      const outcomesRef = collection(db, 'whygos', whygoId, 'outcomes');
      const outcomesSnapshot = await getDocs(outcomesRef);

      const outcomes = outcomesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Sort outcomes by sortOrder
      outcomes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      const whygoData: WhyGOWithOutcomes = {
        id: whygoDoc.id,
        ...whygoDoc.data(),
        outcomes,
      } as WhyGOWithOutcomes;

      setWhyGO(whygoData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (whygoId) {
      fetchWhyGO();
    }
  }, [whygoId]);

  return { whygo, loading, error, refetch: fetchWhyGO };
}
