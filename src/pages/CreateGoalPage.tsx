import { useAuth } from '@/hooks/useAuth';
import { PermissionService } from '@/lib/utils/permissions';
import { IndividualWhyGOForm } from '@/components/forms/IndividualWhyGOForm';
import { CompanyDeptWhyGOForm } from '@/components/forms/CompanyDeptWhyGOForm';

/**
 * Create Goal Page
 *
 * Routes users to appropriate goal creation experience based on their role:
 * - Individual Contributors → IndividualWhyGOForm (with context sidebar)
 * - Department Heads/Executives → CompanyDeptWhyGOForm (streamlined form)
 */
export function CreateGoalPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">You must be logged in to create WhyGOs.</p>
        </div>
      </div>
    );
  }

  // Determine which form to show based on user permissions
  // If user can create company or department goals, show the streamlined form
  // Otherwise, show the individual goal form with context sidebar
  const canCreateCompany = PermissionService.canCreateWhyGO(user as any, 'company');
  const canCreateDepartment = PermissionService.canCreateWhyGO(user as any, 'department');

  if (canCreateCompany || canCreateDepartment) {
    // User is an executive or department head - show streamlined form
    return <CompanyDeptWhyGOForm />;
  }

  // User is an individual contributor - show form with context sidebar
  return <IndividualWhyGOForm />;
}
