import { WhyGOCard } from '@/components/whygo/WhyGOCard';
import { StrategicContext } from '@/components/whygo/StrategicContext';
import { StatusLegend } from '@/components/whygo/StatusLegend';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Building2 } from 'lucide-react';
import { useWhyGOs } from '@/hooks/useWhyGOs';

export function CompanyView() {
  const { whygos, loading, error, refetch } = useWhyGOs({
    level: 'company',
    year: 2026,
    status: ['draft', 'active'],
    sortCompanyGoals: true
  });

  if (loading) return <LoadingState message="Loading company goals..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company WhyGOs</h1>
            <p className="text-gray-600 mt-1">
              Kartel AI's 2026 Strategic Goals
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Context */}
      <StrategicContext />

      {/* WhyGOs */}
      {whygos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Company Goals Yet</h3>
          <p className="text-gray-600">
            Company WhyGOs will appear here once they've been migrated from markdown files.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
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
