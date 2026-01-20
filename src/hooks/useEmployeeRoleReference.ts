import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface SuggestedKPI {
  metric: string;
  target: string;
  alignsTo: string;
  category?: string;
  quarterlyBreakdown?: {
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
  };
}

export interface EmployeeRoleReference {
  id: string;
  title: string;
  department: string;
  reportsTo: string;
  whygoAlignment: string[];
  jobDescription: string;
  coreResponsibilities: string[];
  suggestedKPIs: SuggestedKPI[];
}

export interface UseEmployeeRoleReferenceReturn {
  roleReference: EmployeeRoleReference | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch employee role reference data
 * Provides job description, responsibilities, and suggested KPIs for the given employee
 *
 * @param employeeEmail - The employee's email address (used as Firestore document ID)
 */
export function useEmployeeRoleReference(
  employeeEmail: string | null | undefined
): UseEmployeeRoleReferenceReturn {
  const [roleReference, setRoleReference] = useState<EmployeeRoleReference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoleReference = async () => {
    if (!employeeEmail) {
      setRoleReference(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'employeeRoleReferences', employeeEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRoleReference({
          id: docSnap.id,
          ...docSnap.data(),
        } as EmployeeRoleReference);
      } else {
        // No role reference data found - this is OK for new hires
        setRoleReference(null);
      }
    } catch (err) {
      console.error('Error loading role reference:', err);
      setError('Failed to load role reference data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoleReference();
  }, [employeeEmail]);

  return {
    roleReference,
    loading,
    error,
    refetch: loadRoleReference,
  };
}
