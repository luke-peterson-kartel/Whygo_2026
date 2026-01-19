import { useContext } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Wrench, Check } from 'lucide-react';
import { DevModeContext } from '@/contexts/DevModeContext';
import { useAuth } from '@/hooks/useAuth';
import { getAllDepartments, getDepartmentDisplayName } from '@/lib/departmentUtils';
import { Department } from '@/types/employee.types';

/**
 * Dev mode department switcher dropdown
 * Allows switching between departments for testing
 * Only renders in dev mode
 */
export function DepartmentSwitcher() {
  const { isDevMode, devDepartmentOverride, setDevDepartmentOverride, clearDevDepartmentOverride } = useContext(DevModeContext);
  const { user } = useAuth();

  // Only render in dev mode
  if (!isDevMode) {
    return null;
  }

  const realDepartment = user?.department;
  const currentDepartment = devDepartmentOverride || realDepartment;
  const departments = getAllDepartments();

  const handleDepartmentChange = (dept: Department) => {
    setDevDepartmentOverride(dept);
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Wrench className="h-4 w-4" />
      </MenuButton>

      <MenuItems
        className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 z-50"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Switch Department (Dev Only)
          </p>
        </div>

        {/* Real Department Info */}
        <div className="px-4 py-2 bg-blue-50">
          <p className="text-xs text-blue-900">
            Your Real Department: <strong>{realDepartment ? getDepartmentDisplayName(realDepartment) : 'Unknown'}</strong>
          </p>
        </div>

        {/* Department Options */}
        <div className="py-1">
          {departments.map(({ value, label }) => (
            <MenuItem key={value}>
              {({ focus }) => (
                <button
                  onClick={() => handleDepartmentChange(value)}
                  className={`${
                    focus ? 'bg-gray-100' : ''
                  } ${
                    currentDepartment === value ? 'bg-blue-50' : ''
                  } group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full border-2 ${
                      currentDepartment === value
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {currentDepartment === value && (
                        <span className="flex h-full w-full items-center justify-center text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                      )}
                    </span>
                    {label}
                  </span>
                  {currentDepartment === value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              )}
            </MenuItem>
          ))}
        </div>

        {/* Reset Button */}
        {devDepartmentOverride && (
          <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <button
              onClick={clearDevDepartmentOverride}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reset to Real Department
            </button>
          </div>
        )}
      </MenuItems>
    </Menu>
  );
}
