import { WhyGOCard } from '@/components/whygo/WhyGOCard';
import { StrategicContext } from '@/components/whygo/StrategicContext';
import { StatusLegend } from '@/components/whygo/StatusLegend';
import { Building2 } from 'lucide-react';
import { useWhyGOs } from '@/hooks/useWhyGOs';

export function CompanyView() {
  const { whygos, loading, error, refetch } = useWhyGOs({
    level: 'company',
    year: 2026,
    status: ['draft', 'active'],
    sortCompanyGoals: true
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

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
            />
          ))}
        </div>
      )}

      {/* Legend */}
      {whygos.length > 0 && <StatusLegend />}
    </div>
  );
}
