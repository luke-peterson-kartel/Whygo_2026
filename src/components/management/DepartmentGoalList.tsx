import { useState } from 'react';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { WhyGOSummaryCard } from './WhyGOSummaryCard';
import { calculateDepartmentStatsQ1 } from '@/lib/utils/managementStats';
import { ChevronRight, Users } from 'lucide-react';

interface DepartmentGoalListProps {
  whygos: WhyGOWithOutcomes[];
}

export function DepartmentGoalList({ whygos }: DepartmentGoalListProps) {
  const departmentStats = calculateDepartmentStatsQ1(whygos);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  const toggleDepartment = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };

  if (departmentStats.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Department Performance (Q1)
        </h2>
        <p className="text-gray-600 text-center py-4">No department goals found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Department Performance (Q1)
      </h2>
      <div className="space-y-3">
        {departmentStats.map((dept) => {
          const isExpanded = expandedDepts.has(dept.name);
          return (
            <div key={dept.name} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDepartment(dept.name)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                  <span className="font-semibold text-gray-900">{dept.name}</span>
                  <span className="text-sm text-gray-600">
                    ({dept.goalCount} goal{dept.goalCount !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex gap-2 text-sm">
                  {dept.health.onTrack > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      +{dept.health.onTrack}
                    </span>
                  )}
                  {dept.health.slightlyOff > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      ~{dept.health.slightlyOff}
                    </span>
                  )}
                  {dept.health.offTrack > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                      -{dept.health.offTrack}
                    </span>
                  )}
                  {dept.health.notStarted > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      {dept.health.notStarted}
                    </span>
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-3 bg-white">
                  {dept.whygos.map((whygo) => (
                    <WhyGOSummaryCard key={whygo.id} whygo={whygo} showDepartment={false} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
