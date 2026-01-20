import { useState } from 'react';
import { User, ChevronDown, ChevronRight, Edit2, Save, X } from 'lucide-react';
import { Outcome, StatusIndicator } from '@/types/whygo.types';
import { QuarterCardEditable } from './QuarterCardEditable';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateOutcome } from '@/hooks/useUpdateOutcome';
import { PermissionService } from '@/lib/utils/permissions';

interface OutcomeRowProps {
  outcome: Outcome;
  number: number;
  whygoId: string;
  refetch: () => void;
}

// Helper function to calculate year-to-date progress
function calculateYTDProgress(outcome: Outcome) {
  // Sum all non-null quarterly actuals
  const actuals = [
    outcome.q1Actual,
    outcome.q2Actual,
    outcome.q3Actual,
    outcome.q4Actual
  ].filter(val => val !== null);

  if (actuals.length === 0) {
    return { ytdActual: 0, percentage: 0, hasProgress: false };
  }

  // Convert to numbers and sum
  const ytdActual = actuals.reduce((sum, val) => {
    const numVal = typeof val === 'number' ? val : parseFloat(val as string);
    return sum + (isNaN(numVal) ? 0 : numVal);
  }, 0);

  // Calculate percentage
  const annualTarget = typeof outcome.annualTarget === 'number'
    ? outcome.annualTarget
    : parseFloat(outcome.annualTarget as string);

  const percentage = annualTarget > 0 ? (ytdActual / annualTarget) * 100 : 0;

  return {
    ytdActual,
    percentage: Math.round(percentage),
    hasProgress: true
  };
}

export function OutcomeRow({ outcome, number, whygoId, refetch }: OutcomeRowProps) {
  const { user } = useAuth();
  const { updateOutcome } = useUpdateOutcome();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate YTD progress
  const ytdProgress = calculateYTDProgress(outcome);

  // Determine current status (most recent non-null)
  const currentStatus = outcome.q4Status || outcome.q3Status || outcome.q2Status || outcome.q1Status;

  // Local state for edited values
  const [editedData, setEditedData] = useState<{
    q1Actual: string | number | null;
    q1Status: StatusIndicator;
    q2Actual: string | number | null;
    q2Status: StatusIndicator;
    q3Actual: string | number | null;
    q3Status: StatusIndicator;
    q4Actual: string | number | null;
    q4Status: StatusIndicator;
  }>({
    q1Actual: outcome.q1Actual,
    q1Status: outcome.q1Status,
    q2Actual: outcome.q2Actual,
    q2Status: outcome.q2Status,
    q3Actual: outcome.q3Actual,
    q3Status: outcome.q3Status,
    q4Actual: outcome.q4Actual,
    q4Status: outcome.q4Status,
  });

  // Check if user can edit this outcome
  const canEdit = user ? PermissionService.canUpdateProgress(user, outcome) : false;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    // Update each quarter that changed
    const quarters: Array<'q1' | 'q2' | 'q3' | 'q4'> = ['q1', 'q2', 'q3', 'q4'];

    try {
      for (const quarter of quarters) {
        const actualKey = `${quarter}Actual` as keyof typeof editedData;
        const statusKey = `${quarter}Status` as keyof typeof editedData;

        const actualChanged = editedData[actualKey] !== outcome[actualKey];
        const statusChanged = editedData[statusKey] !== outcome[statusKey];

        if (actualChanged || statusChanged) {
          const result = await updateOutcome(whygoId, outcome, {
            quarter,
            actual: actualChanged ? editedData[actualKey] : undefined,
            status: statusChanged ? editedData[statusKey] : undefined,
          });

          if (!result.success) {
            setError(result.error || 'Update failed');
            setIsSaving(false);
            return;
          }
        }
      }

      // Success - exit edit mode and refresh data
      setIsEditing(false);
      setIsSaving(false);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset edited data to original values
    setEditedData({
      q1Actual: outcome.q1Actual,
      q1Status: outcome.q1Status,
      q2Actual: outcome.q2Actual,
      q2Status: outcome.q2Status,
      q3Actual: outcome.q3Actual,
      q3Status: outcome.q3Status,
      q4Actual: outcome.q4Actual,
      q4Status: outcome.q4Status,
    });
    setIsEditing(false);
    setError(null);
  };

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
            <p className="text-gray-900 font-medium mb-1">{outcome.description}</p>

            {/* Mini Progress Bar */}
            {ytdProgress.hasProgress && (
              <div className="mb-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      currentStatus === '+' ? 'bg-green-500' :
                      currentStatus === '~' ? 'bg-yellow-500' :
                      currentStatus === '-' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(ytdProgress.percentage, 100)}%` }}
                  />
                </div>
              </div>
            )}

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

              {/* Progress Chip */}
              {ytdProgress.hasProgress && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Progress:</span>
                  <ProgressChip
                    percentage={ytdProgress.percentage}
                    status={currentStatus}
                  />
                </div>
              )}
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
          {/* Edit/Save/Cancel Buttons */}
          <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {isEditing ? 'Edit mode - Update actual values and status' : 'Quarterly Progress'}
            </div>
            {canEdit && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Progress
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                      }}
                      disabled={isSaving}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                      disabled={isSaving}
                      className="px-3 py-1.5 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Quarter Cards */}
          <div className="grid grid-cols-4 gap-3">
            <QuarterCardEditable
              quarter="Q1"
              target={outcome.q1Target}
              actual={editedData.q1Actual}
              status={editedData.q1Status}
              unit={outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q1Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q1Status: status })}
            />
            <QuarterCardEditable
              quarter="Q2"
              target={outcome.q2Target}
              actual={editedData.q2Actual}
              status={editedData.q2Status}
              unit={outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q2Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q2Status: status })}
            />
            <QuarterCardEditable
              quarter="Q3"
              target={outcome.q3Target}
              actual={editedData.q3Actual}
              status={editedData.q3Status}
              unit={outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q3Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q3Status: status })}
            />
            <QuarterCardEditable
              quarter="Q4"
              target={outcome.q4Target}
              actual={editedData.q4Actual}
              status={editedData.q4Status}
              unit={outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q4Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q4Status: status })}
            />
          </div>
        </div>
      )}
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

interface ProgressChipProps {
  percentage: number;
  status: StatusIndicator;
}

function ProgressChip({ percentage, status }: ProgressChipProps) {
  const statusColors = {
    '+': 'bg-green-100 text-green-800 border-green-300',
    '~': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    '-': 'bg-red-100 text-red-800 border-red-300',
    null: 'bg-gray-100 text-gray-600 border-gray-300',
  };

  const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${colorClass}`}>
      {percentage}%
      {status && <span className="font-mono ml-0.5">[{status}]</span>}
    </span>
  );
}
