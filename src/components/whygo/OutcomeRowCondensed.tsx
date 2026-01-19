import { Outcome } from '@/types/whygo.types';
import { User } from 'lucide-react';

interface OutcomeRowCondensedProps {
  outcome: Outcome;
  number: number;
}

export function OutcomeRowCondensed({ outcome, number }: OutcomeRowCondensedProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      {/* Header: Outcome description + owner */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {number}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium mb-1">{outcome.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{outcome.ownerName}</span>
          </div>
        </div>
      </div>

      {/* Two-column layout: Annual Target | Q1 Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Annual Target */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Annual Target
          </span>
          <p className="text-lg font-bold text-gray-900">
            {formatValue(outcome.annualTarget, outcome.unit)}
          </p>
        </div>

        {/* Q1 Progress */}
        <div className={`border rounded-lg p-3 ${getStatusBgColor(outcome.q1Status)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Q1 Progress
            </span>
            {outcome.q1Status && (
              <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded ${getStatusBadgeColor(outcome.q1Status)}`}>
                [{outcome.q1Status}]
              </span>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Target:</span>
              <span className="font-semibold text-gray-900">
                {formatValue(outcome.q1Target, outcome.unit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Actual:</span>
              <span className={`font-semibold ${outcome.q1Actual !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                {outcome.q1Actual !== null ? formatValue(outcome.q1Actual, outcome.unit) : '—'}
              </span>
            </div>

            {/* Progress bar (if actual exists) */}
            {outcome.q1Actual !== null && typeof outcome.q1Actual === 'number' && typeof outcome.q1Target === 'number' && outcome.q1Target > 0 && (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round((outcome.q1Actual / outcome.q1Target) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      outcome.q1Status === '+' ? 'bg-green-500' :
                      outcome.q1Status === '~' ? 'bg-yellow-500' :
                      outcome.q1Status === '-' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((outcome.q1Actual / outcome.q1Target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBgColor(status: string | null): string {
  const statusColors = {
    '+': 'bg-green-50 border-green-200',
    '~': 'bg-yellow-50 border-yellow-200',
    '-': 'bg-red-50 border-red-200',
    null: 'bg-white border-gray-200',
  };
  return statusColors[status as keyof typeof statusColors] || statusColors.null;
}

function getStatusBadgeColor(status: string): string {
  const statusBadgeColors = {
    '+': 'bg-green-100 text-green-800',
    '~': 'bg-yellow-100 text-yellow-800',
    '-': 'bg-red-100 text-red-800',
  };
  return statusBadgeColors[status as keyof typeof statusBadgeColors] || 'bg-gray-100 text-gray-600';
}

function formatValue(value: string | number, unit: string): string {
  if (typeof value === 'string') {
    return value;
  }

  switch (unit) {
    case 'USD':
      return `$${value.toLocaleString()}`;
    case 'percentage':
      return `${value}%`;
    case 'count':
      return value.toString();
    default:
      return value.toString();
  }
}
