import { useState } from 'react';
import { ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { COMPANY_TO_DEPARTMENT_MAPPING } from '@/lib/departmentMapping';

interface SupportingDepartmentGoalsProps {
  companyGoal: string;
}

export function SupportingDepartmentGoals({ companyGoal }: SupportingDepartmentGoalsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Find matching goals by checking if the companyGoal starts with any of the mapping keys
  let supportingGoals = COMPANY_TO_DEPARTMENT_MAPPING[companyGoal] || [];

  // If exact match not found, try prefix match
  if (supportingGoals.length === 0) {
    const matchingKey = Object.keys(COMPANY_TO_DEPARTMENT_MAPPING).find(key =>
      companyGoal.startsWith(key)
    );
    if (matchingKey) {
      supportingGoals = COMPANY_TO_DEPARTMENT_MAPPING[matchingKey];
    }
  }

  if (supportingGoals.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      {/* Collapsible Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3
                   bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-blue-700" />
          ) : (
            <ChevronRight className="w-5 h-5 text-blue-700" />
          )}
          <span className="font-medium text-blue-900">
            Supporting Department Goals ({supportingGoals.length})
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-2 space-y-3 pl-4">
          {supportingGoals.map((goal, idx) => (
            <div key={idx} className="border-l-2 border-blue-300 pl-4 py-2">
              {/* Department Badge with WhyGO Number */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900">
                  {goal.departmentDisplayName} Department: WhyGO #{goal.whygoNumber}
                </span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {goal.connectionType}
                </span>
              </div>

              {/* Goal Text */}
              <p className="text-sm text-gray-700 mb-1">
                {goal.goalText}
              </p>

              {/* Connection Description */}
              <p className="text-xs text-gray-500 italic">
                {goal.connectionDescription}
              </p>

              {/* Owner */}
              <p className="text-xs text-gray-600 mt-1">
                Owner: {goal.owner}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
