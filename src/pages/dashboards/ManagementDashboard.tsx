import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWhyGOs } from '@/hooks/useWhyGOs';
import { PermissionService } from '@/lib/utils/permissions';
import { calculateManagementMetrics } from '@/lib/utils/managementStats';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { BarChart3 } from 'lucide-react';

export function ManagementDashboard() {
  const { user } = useAuth();
  const { whygos, loading, error, refetch } = useWhyGOs({
    year: 2026,
    status: ['draft', 'active'],
  });

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    if (!whygos || whygos.length === 0) return null;
    return calculateManagementMetrics(whygos);
  }, [whygos]);

  // Check permissions
  const hasPermission = user && PermissionService.canAccessManagementDashboard(user);

  // Loading state
  if (loading) {
    return <LoadingState message="Loading management data..." />;
  }

  // Permission denied
  if (!hasPermission) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ErrorState
          title="Access Denied"
          message="Management dashboard is only available to executives and department heads."
          action={{
            label: 'Go to Home',
            onClick: () => window.location.href = '/',
          }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ErrorState
          title="Failed to Load Dashboard"
          message={error.message || 'An error occurred while loading the management dashboard.'}
          action={{
            label: 'Retry',
            onClick: refetch,
          }}
        />
      </div>
    );
  }

  // Empty state
  if (!whygos || whygos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Company-wide goal health and status overview
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Goals Yet</h3>
          <p className="text-gray-600 mb-4">
            There are no active or draft goals for 2026. Get started by creating company or department goals.
          </p>
          <a
            href="/goals/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Goal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          Management Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Company-wide goal health and status overview
        </p>
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {/* Summary Metrics - Phase 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary Metrics</h2>
          {metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Goals</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{metrics.totalGoals}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total Outcomes</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{metrics.totalOutcomes}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600 font-medium">Pending Approvals</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">{metrics.pendingApprovals}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">On Track</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{metrics.overallHealth.onTrack}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No metrics available</p>
          )}
        </div>

        {/* Health Breakdown - Phase 4 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Health</h2>
          {metrics ? (
            <div>
              <div className="flex h-8 rounded-lg overflow-hidden">
                {metrics.overallHealth.onTrack > 0 && (
                  <div
                    className="bg-green-500"
                    style={{ width: `${(metrics.overallHealth.onTrack / metrics.totalOutcomes) * 100}%` }}
                  />
                )}
                {metrics.overallHealth.slightlyOff > 0 && (
                  <div
                    className="bg-yellow-500"
                    style={{ width: `${(metrics.overallHealth.slightlyOff / metrics.totalOutcomes) * 100}%` }}
                  />
                )}
                {metrics.overallHealth.offTrack > 0 && (
                  <div
                    className="bg-red-500"
                    style={{ width: `${(metrics.overallHealth.offTrack / metrics.totalOutcomes) * 100}%` }}
                  />
                )}
                {metrics.overallHealth.notStarted > 0 && (
                  <div
                    className="bg-gray-400"
                    style={{ width: `${(metrics.overallHealth.notStarted / metrics.totalOutcomes) * 100}%` }}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm text-gray-600">On Track</p>
                  <p className="text-lg font-semibold">{metrics.overallHealth.onTrack}</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm text-gray-600">Slightly Off</p>
                  <p className="text-lg font-semibold">{metrics.overallHealth.slightlyOff}</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm text-gray-600">Off Track</p>
                  <p className="text-lg font-semibold">{metrics.overallHealth.offTrack}</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm text-gray-600">Not Started</p>
                  <p className="text-lg font-semibold">{metrics.overallHealth.notStarted}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No health data available</p>
          )}
        </div>

        {/* Department Performance - Phase 5 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Performance</h2>
          {metrics && metrics.departmentStats.length > 0 ? (
            <div className="space-y-3">
              {metrics.departmentStats.map((dept) => (
                <div key={dept.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.goalCount} goal{dept.goalCount !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">+{dept.health.onTrack}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">~{dept.health.slightlyOff}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded">-{dept.health.offTrack}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">{dept.health.notStarted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No department goals found</p>
          )}
        </div>

        {/* Quarterly Progress - Phase 6 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quarterly Progress</h2>
          {metrics ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    {metrics.quarterlyBreakdown.map((q) => (
                      <th key={q.quarter} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        {q.quarterLabel}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">On Track</td>
                    {metrics.quarterlyBreakdown.map((q) => (
                      <td key={q.quarter} className="px-4 py-3 text-center text-sm text-green-600 font-semibold">
                        {q.onTrack}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Slightly Off</td>
                    {metrics.quarterlyBreakdown.map((q) => (
                      <td key={q.quarter} className="px-4 py-3 text-center text-sm text-yellow-600 font-semibold">
                        {q.slightlyOff}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Off Track</td>
                    {metrics.quarterlyBreakdown.map((q) => (
                      <td key={q.quarter} className="px-4 py-3 text-center text-sm text-red-600 font-semibold">
                        {q.offTrack}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Not Started</td>
                    {metrics.quarterlyBreakdown.map((q) => (
                      <td key={q.quarter} className="px-4 py-3 text-center text-sm text-gray-600 font-semibold">
                        {q.notStarted}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                    {metrics.quarterlyBreakdown.map((q) => (
                      <td key={q.quarter} className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                        {q.total}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No quarterly data available</p>
          )}
        </div>

        {/* Pending Approvals - Phase 7 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>
          {metrics && metrics.pendingApprovalsList.length > 0 ? (
            <div className="space-y-3">
              {metrics.pendingApprovalsList.map((whygo) => (
                <div key={whygo.id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          {whygo.level}
                        </span>
                        {whygo.department && (
                          <span className="text-xs text-gray-600">{whygo.department}</span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 line-clamp-2">{whygo.goal}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {whygo.ownerName} • {whygo.outcomes.length} outcome{whygo.outcomes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-green-600 font-medium">All goals approved! 🎉</p>
            </div>
          )}
        </div>

        {/* Status Legend - Phase 8 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">On Track (+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Slightly Off (~)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Off Track (-)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Not Started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
