import { SuggestedKPI } from '@/hooks/useEmployeeRoleReference';
import { Target } from 'lucide-react';

interface KPIListItemProps {
  kpi: SuggestedKPI;
}

export function KPIListItem({ kpi }: KPIListItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-2">
        <Target className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{kpi.metric}</p>
          <p className="text-sm text-gray-600 mt-1">Target: {kpi.target}</p>
          {kpi.alignsTo && (
            <p className="text-xs text-blue-600 mt-1">Aligns with: {kpi.alignsTo}</p>
          )}
          {kpi.quarterlyBreakdown && (
            <div className="grid grid-cols-4 gap-1 mt-2 text-xs text-gray-500">
              {kpi.quarterlyBreakdown.q1 && <div>Q1: {kpi.quarterlyBreakdown.q1}</div>}
              {kpi.quarterlyBreakdown.q2 && <div>Q2: {kpi.quarterlyBreakdown.q2}</div>}
              {kpi.quarterlyBreakdown.q3 && <div>Q3: {kpi.quarterlyBreakdown.q3}</div>}
              {kpi.quarterlyBreakdown.q4 && <div>Q4: {kpi.quarterlyBreakdown.q4}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
