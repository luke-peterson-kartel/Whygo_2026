import { useContext } from 'react';
import { DevModeContext } from '@/contexts/DevModeContext';
import { useAuth } from '@/hooks/useAuth';
import { getDepartmentDisplayName } from '@/lib/departmentUtils';
import { AlertTriangle } from 'lucide-react';

/**
 * Dev mode banner that displays at the top of the app when department override is active
 * Only renders in dev mode when an override is set
 */
export function DevModeBanner() {
  const { isDevMode, devDepartmentOverride } = useContext(DevModeContext);
  const { user } = useAuth(); // Get real user department

  // Only show when dev mode is active AND override is set
  if (!isDevMode || !devDepartmentOverride) {
    return null;
  }

  const realDepartment = user?.department ? getDepartmentDisplayName(user.department) : 'Unknown';
  const overrideDepartment = getDepartmentDisplayName(devDepartmentOverride);

  return (
    <div className="bg-amber-100 border-b-2 border-amber-400 px-4 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-center gap-2 text-sm text-amber-900">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-semibold">DEV MODE:</span>
        <span>
          Viewing as <strong>{overrideDepartment}</strong> | Real dept: {realDepartment}
        </span>
      </div>
    </div>
  );
}
