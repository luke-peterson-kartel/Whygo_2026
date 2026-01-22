import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { getQ1OutcomeSummary } from '@/lib/utils/managementStats';
import { useNavigate } from 'react-router-dom';

interface WhyGOSummaryCardProps {
  whygo: WhyGOWithOutcomes;
  showDepartment?: boolean;
}

export function WhyGOSummaryCard({ whygo, showDepartment = false }: WhyGOSummaryCardProps) {
  const navigate = useNavigate();
  const q1Summary = getQ1OutcomeSummary(whygo.outcomes);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'company':
        return 'bg-purple-100 text-purple-800';
      case 'department':
        return 'bg-blue-100 text-blue-800';
      case 'individual':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={() => navigate(`/goals/${whygo.id}`)}
      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${getLevelColor(whygo.level)}`}
          >
            {whygo.level.charAt(0).toUpperCase() + whygo.level.slice(1)}
          </span>
          {showDepartment && whygo.department && (
            <span className="text-xs text-gray-600">{whygo.department}</span>
          )}
        </div>
        <span className="text-sm text-gray-500">{whygo.ownerName}</span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{whygo.goal}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{whygo.why}</p>

      {/* Q1 Progress Bar */}
      <div className="mb-2">
        <div className="h-6 rounded overflow-hidden flex shadow-sm">
          {q1Summary.onTrack > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(q1Summary.onTrack / q1Summary.total) * 100}%` }}
            >
              {q1Summary.onTrack}
            </div>
          )}
          {q1Summary.slightlyOff > 0 && (
            <div
              className="bg-yellow-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(q1Summary.slightlyOff / q1Summary.total) * 100}%` }}
            >
              {q1Summary.slightlyOff}
            </div>
          )}
          {q1Summary.offTrack > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(q1Summary.offTrack / q1Summary.total) * 100}%` }}
            >
              {q1Summary.offTrack}
            </div>
          )}
          {q1Summary.notStarted > 0 && (
            <div
              className="bg-gray-400 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${(q1Summary.notStarted / q1Summary.total) * 100}%` }}
            >
              {q1Summary.notStarted}
            </div>
          )}
        </div>
      </div>

      {/* Text Summary */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {q1Summary.onTrack} on track
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          {q1Summary.slightlyOff} slightly off
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {q1Summary.offTrack} off track
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          {q1Summary.notStarted} not started
        </span>
      </div>
    </div>
  );
}
