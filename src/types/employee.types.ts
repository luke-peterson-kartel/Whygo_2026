import { Timestamp } from 'firebase/firestore';

export type EmployeeLevel = 'executive' | 'department_head' | 'manager' | 'ic';
export type EmploymentType = 'W2' | 'Contractor' | 'Trial' | 'International';
export type LocationType = 'On-Site' | 'Remote' | 'International';
export type Department = 'management' | 'sales' | 'production' | 'generative' | 'community' | 'platform';

export interface Employee {
  id: string;
  email: string;
  name: string;
  title: string;
  department: Department;
  reportsTo: string | null;
  level: EmployeeLevel;
  employmentType: EmploymentType;
  location: LocationType;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DepartmentInfo {
  id: Department;
  name: string;
  head: string;
  teamSize: number;
  primaryCompanyWhyGO: string;
  secondaryCompanyWhyGO: string | null;
}

export const DEPARTMENTS: Record<Department, string> = {
  management: 'Management',
  sales: 'Sales',
  production: 'Production',
  generative: 'Generative',
  community: 'Community & Partnerships',
  platform: 'Platform',
};
