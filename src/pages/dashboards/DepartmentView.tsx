import { WhyGOCard } from '@/components/whygo/WhyGOCard';
import { StatusLegend } from '@/components/whygo/StatusLegend';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useWhyGOs } from '@/hooks/useWhyGOs';
import { DEPARTMENT_CONFIGS } from '@/lib/departmentConfig';

interface DepartmentViewProps {
  department: string;
  customSections?: React.ReactNode;
}

export function DepartmentView({ department, customSections }: DepartmentViewProps) {
  // Get department config
  const config = DEPARTMENT_CONFIGS[department.toLowerCase()];

  if (!config) {
    return <ErrorState message={`Department "${department}" not found`} />;
  }

  // Fetch department WhyGOs
  const { whygos, loading, error, refetch } = useWhyGOs({
    level: 'department',
    department: config.displayName,
    year: 2026,
    status: ['draft', 'active'],
  });

  if (loading) return <LoadingState message={`Loading ${config.displayName} goals...`} />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const Icon = config.icon;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 bg-gradient-to-br ${config.colorScheme} rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {config.displayName} Department
            </h1>
            <p className="text-gray-600 mt-1">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Custom Sections (e.g., Four Handoff Cycle for Production) */}
      {customSections && (
        <div className="mb-6">
          {customSections}
        </div>
      )}

      {/* WhyGOs */}
      {whygos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {config.displayName} Goals Yet
          </h3>
          <p className="text-gray-600">
            WhyGOs will appear here once they've been migrated from markdown files.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {whygos.map((whygo, index) => (
            <WhyGOCard
              key={whygo.id}
              whygo={whygo}
              number={index + 1}
              showOwner={true}
              refetch={refetch}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      {whygos.length > 0 && <StatusLegend />}
    </div>
  );
}
