import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { CondensedWhyGOCard } from './CondensedWhyGOCard';

interface DepartmentSectionProps {
  department: string;  // 'Sales', 'Production', etc.
  whygos: WhyGOWithOutcomes[];
  colorScheme: string;  // gradient class
  defaultExpanded?: boolean;
}

export function DepartmentSection({
  department,
  whygos,
  colorScheme,
  defaultExpanded = false
}: DepartmentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-6 bg-gradient-to-r ${colorScheme} text-white transition-all hover:opacity-90`}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
          <h2 className="text-2xl font-bold">{department} WhyGOs</h2>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            {whygos.length} {whygos.length === 1 ? 'Goal' : 'Goals'}
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 space-y-6">
          {whygos.map((whygo, index) => (
            <CondensedWhyGOCard
              key={whygo.id}
              whygo={whygo}
              number={index + 1}
              colorScheme={colorScheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
