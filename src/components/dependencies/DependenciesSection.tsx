import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FourHandoffCycle } from '@/components/department/custom/production/FourHandoffCycle';
import PodStructure from '@/components/department/custom/production/PodStructure';

export function DependenciesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg overflow-hidden">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-6 hover:bg-orange-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Key Dependencies & Systems
              </h2>
              <p className="text-gray-600">
                The Four Handoff Cycle and Pod Structure enable all goals across the organization
              </p>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0 ml-4" />
            ) : (
              <ChevronRight className="w-6 h-6 text-gray-600 flex-shrink-0 ml-4" />
            )}
          </div>
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="px-6 pb-6 space-y-8">
            <FourHandoffCycle />
            <PodStructure />
          </div>
        )}
      </div>
    </div>
  );
}
