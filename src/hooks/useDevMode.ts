import { useContext } from 'react';
import { useAuth } from './useAuth';
import { DevModeContext } from '@/contexts/DevModeContext';

/**
 * Dev mode wrapper for useAuth that applies department override for testing
 * In production, behaves identically to useAuth()
 * In dev mode, allows overriding user.department via DevModeContext
 */
export function useDevMode() {
  const auth = useAuth();
  const { devDepartmentOverride, isDevMode } = useContext(DevModeContext);

  // If dev mode active and override set, return modified user
  if (isDevMode && devDepartmentOverride && auth.user) {
    return {
      ...auth,
      user: {
        ...auth.user,
        department: devDepartmentOverride
      }
    };
  }

  // Otherwise return unchanged auth
  return auth;
}
