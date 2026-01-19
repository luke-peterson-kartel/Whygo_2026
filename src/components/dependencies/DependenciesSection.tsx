import { FourHandoffCycle } from '@/components/department/custom/production/FourHandoffCycle';
import PodStructure from '@/components/department/custom/production/PodStructure';

export function DependenciesSection() {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Key Dependencies & Systems
        </h2>
        <p className="text-gray-600">
          The Four Handoff Cycle and Pod Structure enable all goals across the organization
        </p>
      </div>

      {/* Unified visual container for both components */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 space-y-8">
        <FourHandoffCycle />
        <PodStructure />
      </div>
    </div>
  );
}
