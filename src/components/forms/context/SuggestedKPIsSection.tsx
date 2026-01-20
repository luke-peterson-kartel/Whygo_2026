import { useState } from 'react';
import { ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import { EmployeeRoleReference } from '@/hooks/useEmployeeRoleReference';
import { KPIListItem } from './KPIListItem';

interface SuggestedKPIsSectionProps {
  roleReference: EmployeeRoleReference;
}

export function SuggestedKPIsSection({ roleReference }: SuggestedKPIsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left mb-3 group"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Suggested KPIs</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {roleReference.suggestedKPIs.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 italic">
                No suggested KPIs available for this role.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-600 mb-3">
                Based on your role as {roleReference.title}, here are recommended metrics to consider for your outcomes:
              </p>
              <div className="space-y-2">
                {roleReference.suggestedKPIs.map((kpi, index) => (
                  <KPIListItem key={index} kpi={kpi} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
