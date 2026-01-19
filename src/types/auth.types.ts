import type { Employee } from './employee.types';

export interface AuthUser extends Employee {
  // Additional auth-specific fields can be added here
  firebaseUid: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}
