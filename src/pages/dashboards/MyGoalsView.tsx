import { User } from 'lucide-react';
import { WhyGOCard } from '@/components/whygo/WhyGOCard';
import { StatusLegend } from '@/components/whygo/StatusLegend';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { useWhyGOs } from '@/hooks/useWhyGOs';
import { useNavigate } from 'react-router-dom';

export function MyGoalsView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { whygos, loading, error, refetch } = useWhyGOs({
    level: 'individual',
    ownerId: user?.email,
    year: 2026,
    status: ['draft', 'active'],
  });

  if (loading) return <LoadingState message="Loading your goals..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My 2026 WhyGOs</h1>
            <p className="text-gray-600 mt-1">
              {user?.name}'s Personal Strategic Goals
            </p>
          </div>
        </div>
      </div>

      {/* WhyGOs or Empty State */}
      {whygos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Personal Goals Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first personal WhyGO to get started with your 2026 goals.
          </p>
          <button
            onClick={() => navigate('/goals/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First WhyGO
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {whygos.map((whygo, index) => (
            <WhyGOCard
              key={whygo.id}
              whygo={whygo}
              number={index + 1}
              showOwner={false}
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
