import { StatusDropdown } from './StatusDropdown';
import type { StatusIndicator } from '@/types/whygo.types';

interface QuarterCardEditableProps {
  quarter: string;
  target: string | number;
  actual: string | number | null;
  status: StatusIndicator;
  unit: string;
  isEditing: boolean;
  onActualChange: (value: string | number | null) => void;
  onStatusChange: (status: StatusIndicator) => void;
}

export function QuarterCardEditable({
  quarter,
  target,
  actual,
  status,
  unit,
  isEditing,
  onActualChange,
  onStatusChange,
}: QuarterCardEditableProps) {
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

  // Edit mode border
  const editBorder = isEditing ? 'ring-2 ring-blue-500' : '';

  // Handle actual value input change
  const handleActualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onActualChange(null);
    } else {
      // Try to parse as number if possible
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onActualChange(numValue);
      } else {
        onActualChange(value);
      }
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${bgColor} ${editBorder}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-900">{quarter}</span>
        {!isEditing && status && (
          <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded ${badgeColor}`}>
            [{status}]
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs">
        {/* Target (read-only) */}
        <div className="flex justify-between">
          <span className="text-gray-600">Target:</span>
          <span className="font-semibold text-gray-900">
            {formatValue(target, unit)}
          </span>
        </div>

        {/* Actual (editable or read-only) */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Actual:</span>
          {isEditing ? (
            <input
              type="text"
              value={actual ?? ''}
              onChange={handleActualChange}
              className="w-20 px-1.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right font-semibold"
              placeholder="—"
            />
          ) : (
            <span className={`font-semibold ${actual !== null ? 'text-gray-900' : 'text-gray-400'}`}>
              {actual !== null ? formatValue(actual, unit) : '—'}
            </span>
          )}
        </div>

        {/* Status (editable or badge) */}
        {isEditing && (
          <div className="pt-2">
            <label className="block text-xs text-gray-600 mb-1">Status:</label>
            <StatusDropdown
              value={status}
              onChange={onStatusChange}
            />
          </div>
        )}

        {/* Progress bar (only in view mode with valid numbers) */}
        {!isEditing && actual !== null && typeof actual === 'number' && typeof target === 'number' && target > 0 && (
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
