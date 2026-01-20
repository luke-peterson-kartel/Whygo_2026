import { Info } from 'lucide-react';
import { useEmployeeRoleReference } from '@/hooks/useEmployeeRoleReference';
import { RoleContextSection } from './RoleContextSection';
import { DepartmentWhyGOsSection } from './DepartmentWhyGOsSection';
import { SuggestedKPIsSection } from './SuggestedKPIsSection';

interface ContextSidebarProps {
  userEmail: string;
}

export function ContextSidebar({ userEmail }: ContextSidebarProps) {
  const { roleReference, loading, error } = useEmployeeRoleReference(userEmail);

  if (loading) {
    return (
      <div className="sticky top-6 bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !roleReference) {
    return (
      <div className="sticky top-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">No Role Reference Found</h3>
            <p className="text-sm text-yellow-800">
              We don't have role reference data for your account yet. You can still create your WhyGOs manually.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-6 bg-white border border-gray-200 rounded-lg p-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Context & Guidance</h2>
          <p className="text-sm text-gray-600">
            Reference this information while creating your 2026 WhyGOs
          </p>
        </div>

        {/* Role Context Section */}
        <RoleContextSection roleReference={roleReference} />

        {/* Department WhyGOs Section */}
        <DepartmentWhyGOsSection department={roleReference.department} />

        {/* Suggested KPIs Section */}
        <SuggestedKPIsSection roleReference={roleReference} />
      </div>
    </div>
  );
}
