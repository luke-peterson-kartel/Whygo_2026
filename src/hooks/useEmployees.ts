import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Employee {
  id: string;
  email: string;
  name: string;
  title: string;
  department: string;
}

export interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all employees from Firestore
 * Used for outcome owner selection dropdowns
 */
export function useEmployees(): UseEmployeesReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      const loadedEmployees: Employee[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];

      setEmployees(loadedEmployees);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    refetch: loadEmployees,
  };
}
