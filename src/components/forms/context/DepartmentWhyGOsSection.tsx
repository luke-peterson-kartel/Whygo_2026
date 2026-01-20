import { useState } from 'react';
import { ChevronDown, ChevronRight, Target } from 'lucide-react';
import { useWhyGOs } from '@/hooks/useWhyGOs';
import { OutcomeRowCondensed } from '@/components/whygo/OutcomeRowCondensed';

interface DepartmentWhyGOsSectionProps {
  department: string;
}

export function DepartmentWhyGOsSection({ department }: DepartmentWhyGOsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { whygos, loading, error } = useWhyGOs({
    level: 'department',
    department,
    year: 2026,
    status: ['active', 'draft'],
    sortCompanyGoals: false,
  });

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left mb-3 group"
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Department WhyGOs</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {loading && (
            <p className="text-sm text-gray-500 italic">Loading department goals...</p>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && whygos.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 italic">
                No department WhyGOs found yet.
              </p>
            </div>
          )}

          {!loading && !error && whygos.length > 0 && (
            <>
              <p className="text-xs text-gray-600 mb-3">
                These are your department's goals for 2026. Your individual WhyGOs should support these objectives.
              </p>
              <div className="space-y-3">
                {whygos.map((whygo, index) => (
                  <div key={whygo.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{whygo.goal}</p>
                        <p className="text-xs text-gray-600 mt-1">{whygo.why}</p>
                      </div>
                    </div>
                    {whygo.outcomes && whygo.outcomes.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Key Outcomes:</p>
                        <ul className="space-y-1">
                          {whygo.outcomes.slice(0, 3).map((outcome) => (
                            <li key={outcome.id} className="text-xs text-gray-700">
                              • {outcome.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
