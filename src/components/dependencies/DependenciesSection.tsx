import { FourHandoffCycle } from '@/components/department/custom/production/FourHandoffCycle';
import PodStructure from '@/components/department/custom/production/PodStructure';

export function DependenciesSection() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Key Dependencies & Systems
        </h2>
        <p className="text-gray-600">
          The handoff cycle and pod structure enable all goals across the organization
        </p>
      </div>

      {/* Import and display existing components */}
      <FourHandoffCycle />
      <PodStructure />
    </div>
  );
}
