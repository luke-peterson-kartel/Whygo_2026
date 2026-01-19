import { Department, DEPARTMENTS } from '@/types/employee.types';

/**
 * Convert lowercase department to display name
 * @example getDepartmentDisplayName('production') => 'Production'
 */
export function getDepartmentDisplayName(dept: Department): string {
  return DEPARTMENTS[dept];
}

/**
 * Convert lowercase department to Firestore query format (capitalize first letter)
 * Firestore stores departments lowercase but queries need capitalized format
 * @example getDepartmentQueryValue('production') => 'Production'
 */
export function getDepartmentQueryValue(dept: Department): string {
  return dept.charAt(0).toUpperCase() + dept.slice(1);
}

/**
 * Get all departments as options for selector/dropdown
 * @returns Array of {value, label} for all departments
 */
export function getAllDepartments(): Array<{value: Department, label: string}> {
  return Object.entries(DEPARTMENTS).map(([key, label]) => ({
    value: key as Department,
    label: label
  }));
}
