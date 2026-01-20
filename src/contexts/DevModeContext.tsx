import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Department, EmployeeLevel } from '@/types/employee.types';

interface DevModeContextType {
  isDevMode: boolean;
  devDepartmentOverride: Department | null;
  setDevDepartmentOverride: (dept: Department | null) => void;
  clearDevDepartmentOverride: () => void;
  devLevelOverride: EmployeeLevel | null;
  setDevLevelOverride: (level: EmployeeLevel | null) => void;
  clearDevLevelOverride: () => void;
}

export const DevModeContext = createContext<DevModeContextType>({
  isDevMode: false,
  devDepartmentOverride: null,
  setDevDepartmentOverride: () => {},
  clearDevDepartmentOverride: () => {},
  devLevelOverride: null,
  setDevLevelOverride: () => {},
  clearDevLevelOverride: () => {},
});

interface DevModeProviderProps {
  children: ReactNode;
}

const DEPT_STORAGE_KEY = 'devDepartmentOverride';
const LEVEL_STORAGE_KEY = 'devLevelOverride';

export function DevModeProvider({ children }: DevModeProviderProps) {
  // Only enable in dev mode
  const isDevMode = import.meta.env.DEV;

  // Initialize department override from sessionStorage (only in dev mode)
  const [devDepartmentOverride, setDevDepartmentOverride] = useState<Department | null>(() => {
    if (!isDevMode) return null;
    const stored = sessionStorage.getItem(DEPT_STORAGE_KEY);
    return stored as Department | null;
  });

  // Initialize level override from sessionStorage (only in dev mode)
  const [devLevelOverride, setDevLevelOverride] = useState<EmployeeLevel | null>(() => {
    if (!isDevMode) return null;
    const stored = sessionStorage.getItem(LEVEL_STORAGE_KEY);
    return stored as EmployeeLevel | null;
  });

  // Sync department override to sessionStorage
  useEffect(() => {
    if (!isDevMode) return;

    if (devDepartmentOverride) {
      sessionStorage.setItem(DEPT_STORAGE_KEY, devDepartmentOverride);
    } else {
      sessionStorage.removeItem(DEPT_STORAGE_KEY);
    }
  }, [devDepartmentOverride, isDevMode]);

  // Sync level override to sessionStorage
  useEffect(() => {
    if (!isDevMode) return;

    if (devLevelOverride) {
      sessionStorage.setItem(LEVEL_STORAGE_KEY, devLevelOverride);
    } else {
      sessionStorage.removeItem(LEVEL_STORAGE_KEY);
    }
  }, [devLevelOverride, isDevMode]);

  const clearDevDepartmentOverride = () => {
    setDevDepartmentOverride(null);
  };

  const clearDevLevelOverride = () => {
    setDevLevelOverride(null);
  };

  const value: DevModeContextType = {
    isDevMode,
    devDepartmentOverride,
    setDevDepartmentOverride,
    clearDevDepartmentOverride,
    devLevelOverride,
    setDevLevelOverride,
    clearDevLevelOverride,
  };

  return (
    <DevModeContext.Provider value={value}>
      {children}
    </DevModeContext.Provider>
  );
}
