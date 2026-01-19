import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Department } from '@/types/employee.types';

interface DevModeContextType {
  isDevMode: boolean;
  devDepartmentOverride: Department | null;
  setDevDepartmentOverride: (dept: Department | null) => void;
  clearDevDepartmentOverride: () => void;
}

export const DevModeContext = createContext<DevModeContextType>({
  isDevMode: false,
  devDepartmentOverride: null,
  setDevDepartmentOverride: () => {},
  clearDevDepartmentOverride: () => {},
});

interface DevModeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'devDepartmentOverride';

export function DevModeProvider({ children }: DevModeProviderProps) {
  // Only enable in dev mode
  const isDevMode = import.meta.env.DEV;

  // Initialize from sessionStorage (only in dev mode)
  const [devDepartmentOverride, setDevDepartmentOverride] = useState<Department | null>(() => {
    if (!isDevMode) return null;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored as Department | null;
  });

  // Sync to sessionStorage whenever override changes
  useEffect(() => {
    if (!isDevMode) return;

    if (devDepartmentOverride) {
      sessionStorage.setItem(STORAGE_KEY, devDepartmentOverride);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [devDepartmentOverride, isDevMode]);

  const clearDevDepartmentOverride = () => {
    setDevDepartmentOverride(null);
  };

  const value: DevModeContextType = {
    isDevMode,
    devDepartmentOverride,
    setDevDepartmentOverride,
    clearDevDepartmentOverride,
  };

  return (
    <DevModeContext.Provider value={value}>
      {children}
    </DevModeContext.Provider>
  );
}
