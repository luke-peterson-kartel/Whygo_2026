import { useMemo } from 'react';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { Target } from 'lucide-react';
import { StrategicContext } from '@/components/whygo/StrategicContext';
import { DependenciesSection } from '@/components/dependencies/DependenciesSection';
import { DepartmentSection } from '@/components/whygo/DepartmentSection';
import { StatusLegend } from '@/components/whygo/StatusLegend';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { getDepartmentColor } from '@/lib/departmentColors';
import { useWhyGOs } from '@/hooks/useWhyGOs';

interface DepartmentConfig {
  key: string;
  name: string;
  colorScheme: string;
  defaultExpanded?: boolean;
}

const DEPARTMENT_CONFIGS: DepartmentConfig[] = [
  { key: 'company', name: 'Company', colorScheme: 'from-blue-600 to-purple-600', defaultExpanded: true },
  { key: 'sales', name: 'Sales', colorScheme: getDepartmentColor('Sales') },
  { key: 'production', name: 'Production', colorScheme: getDepartmentColor('Production') },
  { key: 'generative', name: 'Generative', colorScheme: getDepartmentColor('Generative') },
  { key: 'platform', name: 'Platform', colorScheme: getDepartmentColor('Platform') },
  { key: 'community', name: 'Community', colorScheme: getDepartmentColor('Community') },
];

export function AllGoalsView() {
  const { whygos, loading, error, refetch } = useWhyGOs({
    year: 2026,
    status: ['draft', 'active'],
    sortCompanyGoals: true
  });

  // Organize WhyGOs by department
  const organizedByDept = useMemo(() => {
    const result: Record<string, WhyGOWithOutcomes[]> = {
      company: whygos.filter(w => w.level === 'company'),
      sales: whygos.filter(w => w.level === 'department' && w.department === 'Sales'),
      production: whygos.filter(w => w.level === 'department' && w.department === 'Production'),
      generative: whygos.filter(w => w.level === 'department' && w.department === 'Generative'),
      platform: whygos.filter(w => w.level === 'department' && w.department === 'Platform'),
      community: whygos.filter(w => w.level === 'department' && w.department === 'Community'),
    };
    return result;
  }, [whygos]);

  if (loading) return <LoadingState message="Loading all goals..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const totalWhyGOs = Object.values(organizedByDept).reduce((sum, whygos) => sum + whygos.length, 0);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Goals</h1>
            <p className="text-gray-600 mt-1">
              2026 Strategic Alignment - Company & All Department Goals
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Context */}
      <StrategicContext />

      {/* Dependencies Section */}
      <DependenciesSection />

      {/* ALL SECTIONS - Collapsible by Department */}
      {totalWhyGOs === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600">
            WhyGOs will appear here once they've been migrated from markdown files.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {DEPARTMENT_CONFIGS.map(({ key, name, colorScheme, defaultExpanded }) => {
            const deptWhyGOs = organizedByDept[key];
            if (!deptWhyGOs || deptWhyGOs.length === 0) return null;

            return (
              <DepartmentSection
                key={key}
                department={name}
                whygos={deptWhyGOs}
                colorScheme={colorScheme}
                defaultExpanded={defaultExpanded}
              />
            );
          })}
        </div>
      )}

      {/* Status Legend */}
      {totalWhyGOs > 0 && <StatusLegend />}
    </div>
  );
}
