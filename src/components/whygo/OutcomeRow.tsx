import { useState } from 'react';
import { Outcome } from '@/types/whygo.types';
import { User, ChevronDown, ChevronRight } from 'lucide-react';

interface OutcomeRowProps {
  outcome: Outcome;
  number: number;
}

export function OutcomeRow({ outcome, number }: OutcomeRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsible Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={`Toggle outcome ${number}: ${outcome.description}`}
        className="w-full text-left p-4 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {number}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium mb-2">{outcome.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{outcome.ownerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Annual Target:</span>
                <span className="font-semibold text-gray-900">
                  {formatValue(outcome.annualTarget, outcome.unit)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </button>

      {/* Quarterly Progress - Conditionally Rendered */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-3 pt-2 border-t border-gray-200">
            <QuarterCard
              quarter="Q1"
              target={outcome.q1Target}
              actual={outcome.q1Actual}
              status={outcome.q1Status}
              unit={outcome.unit}
            />
            <QuarterCard
              quarter="Q2"
              target={outcome.q2Target}
              actual={outcome.q2Actual}
              status={outcome.q2Status}
              unit={outcome.unit}
            />
            <QuarterCard
              quarter="Q3"
              target={outcome.q3Target}
              actual={outcome.q3Actual}
              status={outcome.q3Status}
              unit={outcome.unit}
            />
            <QuarterCard
              quarter="Q4"
              target={outcome.q4Target}
              actual={outcome.q4Actual}
              status={outcome.q4Status}
              unit={outcome.unit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface QuarterCardProps {
  quarter: string;
  target: string | number;
  actual: string | number | null;
  status: string | null;
  unit: string;
}

function QuarterCard({ quarter, target, actual, status, unit }: QuarterCardProps) {
  // Determine background color based on status
  const statusColors = {
    '+': 'bg-green-50 border-green-200',
    '~': 'bg-yellow-50 border-yellow-200',
    '-': 'bg-red-50 border-red-200',
    null: 'bg-white border-gray-200',
  };

  const statusBadgeColors = {
    '+': 'bg-green-100 text-green-800',
    '~': 'bg-yellow-100 text-yellow-800',
    '-': 'bg-red-100 text-red-800',
    null: 'bg-gray-100 text-gray-600',
  };

  const bgColor = statusColors[status as keyof typeof statusColors] || statusColors.null;
  const badgeColor = statusBadgeColors[status as keyof typeof statusBadgeColors] || statusBadgeColors.null;

  return (
    <div className={`border rounded-lg p-3 ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-900">{quarter}</span>
        {status && (
          <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded ${badgeColor}`}>
            [{status}]
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Target:</span>
          <span className="font-semibold text-gray-900">
            {formatValue(target, unit)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Actual:</span>
          <span className={`font-semibold ${actual !== null ? 'text-gray-900' : 'text-gray-400'}`}>
            {actual !== null ? formatValue(actual, unit) : '—'}
          </span>
        </div>

        {actual !== null && typeof actual === 'number' && typeof target === 'number' && target > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Progress:</span>
              <span className="font-semibold text-gray-900">
                {Math.round((actual / target) * 100)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  status === '+' ? 'bg-green-500' :
                  status === '~' ? 'bg-yellow-500' :
                  status === '-' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min((actual / target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
