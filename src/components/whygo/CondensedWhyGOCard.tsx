import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { OutcomeRowCondensed } from './OutcomeRowCondensed';
import { SupportingDepartmentGoals } from './SupportingDepartmentGoals';
import { Target, User, Calendar } from 'lucide-react';

interface CondensedWhyGOCardProps {
  whygo: WhyGOWithOutcomes;
  number: number;
}

export function CondensedWhyGOCard({ whygo, number }: CondensedWhyGOCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header - Reuse from WhyGOCard */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3">
              <Target className="w-4 h-4" />
              <span>WhyGO #{number}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{whygo.goal}</h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{whygo.ownerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{whygo.year}</span>
              </div>
            </div>
          </div>

          <div className="ml-4">
            <StatusBadge status={whygo.status} />
          </div>
        </div>
      </div>

      {/* WHY Statement */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
              WHY
            </div>
          </div>
          <p className="text-gray-800 leading-relaxed">{whygo.why}</p>
        </div>
      </div>

      {/* Outcomes - CONDENSED (Annual + Q1 only) */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Outcomes (Annual Target + Q1 Progress)
        </h4>

        {whygo.outcomes.length === 0 ? (
          <p className="text-gray-600 italic">No outcomes defined yet.</p>
        ) : (
          <div className="space-y-4">
            {whygo.outcomes.map((outcome, index) => (
              <OutcomeRowCondensed
                key={outcome.id}
                outcome={outcome}
                number={index + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Supporting Department Goals */}
      <div className="p-6">
        <SupportingDepartmentGoals companyGoal={whygo.goal} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300',
    active: 'bg-green-100 text-green-800 border-green-300',
    archived: 'bg-purple-100 text-purple-800 border-purple-300',
  }[status] || 'bg-gray-100 text-gray-800 border-gray-300';

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles}`}>
      {label}
    </span>
  );
}
