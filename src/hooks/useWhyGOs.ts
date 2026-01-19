import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WhyGOWithOutcomes } from '@/types/whygo.types';

export interface UseWhyGOsOptions {
  level?: 'company' | 'department';
  department?: string;
  year?: number;
  status?: string[];
  sortCompanyGoals?: boolean;
}

export interface UseWhyGOsReturn {
  whygos: WhyGOWithOutcomes[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const COMPANY_GOAL_ORDER = [
  'Onboard 10 enterprise clients',
  'Establish operational infrastructure',
  'Deploy the three-pillar',
  'Build Discord community'
];

export function useWhyGOs(options: UseWhyGOsOptions = {}): UseWhyGOsReturn {
  const {
    level,
    department,
    year = 2026,
    status = ['draft', 'active'],
    sortCompanyGoals = true
  } = options;

  const [whygos, setWhygos] = useState<WhyGOWithOutcomes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWhyGOs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query constraints
      const whygosRef = collection(db, 'whygos');
      const constraints = [
        where('year', '==', year),
        where('status', 'in', status)
      ];

      // Add level filter if specified
      if (level) {
        constraints.push(where('level', '==', level));
      }

      // Add department filter if specified
      if (department) {
        constraints.push(where('department', '==', department));
      }

      const q = query(whygosRef, ...constraints);
      const querySnapshot = await getDocs(q);
      const loadedWhyGOs: WhyGOWithOutcomes[] = [];

      // Load WhyGOs with outcomes subcollection
      for (const doc of querySnapshot.docs) {
        const whygoData = { id: doc.id, ...doc.data() } as WhyGOWithOutcomes;

        // Load outcomes subcollection
        const outcomesRef = collection(db, 'whygos', doc.id, 'outcomes');
        const outcomesSnapshot = await getDocs(outcomesRef);

        whygoData.outcomes = outcomesSnapshot.docs.map(outcomeDoc => ({
          id: outcomeDoc.id,
          ...outcomeDoc.data(),
        })) as any[];

        // Sort outcomes by sortOrder
        whygoData.outcomes.sort((a, b) => a.sortOrder - b.sortOrder);

        loadedWhyGOs.push(whygoData);
      }

      // Sort company WhyGOs if requested
      if (sortCompanyGoals && (!level || level === 'company')) {
        loadedWhyGOs.sort((a, b) => {
          const aIndex = COMPANY_GOAL_ORDER.findIndex(prefix => a.goal?.startsWith(prefix));
          const bIndex = COMPANY_GOAL_ORDER.findIndex(prefix => b.goal?.startsWith(prefix));

          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return 0;
        });
      }

      setWhygos(loadedWhyGOs);
    } catch (err) {
      console.error('Error loading WhyGOs:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWhyGOs();
  }, [level, department, year, JSON.stringify(status)]);

  return {
    whygos,
    loading,
    error,
    refetch: loadWhyGOs
  };
}
