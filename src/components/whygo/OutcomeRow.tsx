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
    description: string;
    annualTarget: number;
    unit: string;
    q1Target: number;
    q2Target: number;
    q3Target: number;
    q4Target: number;
    q1Actual: string | number | null;
    q1Status: StatusIndicator;
    q2Actual: string | number | null;
    q2Status: StatusIndicator;
    q3Actual: string | number | null;
    q3Status: StatusIndicator;
    q4Actual: string | number | null;
    q4Status: StatusIndicator;
  }>({
    description: outcome.description,
    annualTarget: typeof outcome.annualTarget === 'number' ? outcome.annualTarget : parseFloat(outcome.annualTarget as string),
    unit: outcome.unit,
    q1Target: typeof outcome.q1Target === 'number' ? outcome.q1Target : parseFloat(outcome.q1Target as string),
    q2Target: typeof outcome.q2Target === 'number' ? outcome.q2Target : parseFloat(outcome.q2Target as string),
    q3Target: typeof outcome.q3Target === 'number' ? outcome.q3Target : parseFloat(outcome.q3Target as string),
    q4Target: typeof outcome.q4Target === 'number' ? outcome.q4Target : parseFloat(outcome.q4Target as string),
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
  const canEditDetails = user ? PermissionService.canEditOutcomeDetails(user) : false;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Check if outcome details changed
      const detailsChanged = {
        description: editedData.description !== outcome.description,
        annualTarget: editedData.annualTarget !== (typeof outcome.annualTarget === 'number' ? outcome.annualTarget : parseFloat(outcome.annualTarget as string)),
        unit: editedData.unit !== outcome.unit,
        q1Target: editedData.q1Target !== (typeof outcome.q1Target === 'number' ? outcome.q1Target : parseFloat(outcome.q1Target as string)),
        q2Target: editedData.q2Target !== (typeof outcome.q2Target === 'number' ? outcome.q2Target : parseFloat(outcome.q2Target as string)),
        q3Target: editedData.q3Target !== (typeof outcome.q3Target === 'number' ? outcome.q3Target : parseFloat(outcome.q3Target as string)),
        q4Target: editedData.q4Target !== (typeof outcome.q4Target === 'number' ? outcome.q4Target : parseFloat(outcome.q4Target as string)),
      };

      const hasDetailsChanges = Object.values(detailsChanged).some(changed => changed);

      // If details changed, update them in a single call
      if (hasDetailsChanges) {
        const detailUpdates: any = {};
        if (detailsChanged.description) detailUpdates.description = editedData.description;
        if (detailsChanged.annualTarget) detailUpdates.annualTarget = editedData.annualTarget;
        if (detailsChanged.unit) detailUpdates.unit = editedData.unit;
        if (detailsChanged.q1Target) detailUpdates.q1Target = editedData.q1Target;
        if (detailsChanged.q2Target) detailUpdates.q2Target = editedData.q2Target;
        if (detailsChanged.q3Target) detailUpdates.q3Target = editedData.q3Target;
        if (detailsChanged.q4Target) detailUpdates.q4Target = editedData.q4Target;

        const result = await updateOutcome(whygoId, outcome, detailUpdates);
        if (!result.success) {
          setError(result.error || 'Failed to update outcome details');
          setIsSaving(false);
          return;
        }
      }

      // Update each quarter's progress that changed
      const quarters: Array<'q1' | 'q2' | 'q3' | 'q4'> = ['q1', 'q2', 'q3', 'q4'];

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
      description: outcome.description,
      annualTarget: typeof outcome.annualTarget === 'number' ? outcome.annualTarget : parseFloat(outcome.annualTarget as string),
      unit: outcome.unit,
      q1Target: typeof outcome.q1Target === 'number' ? outcome.q1Target : parseFloat(outcome.q1Target as string),
      q2Target: typeof outcome.q2Target === 'number' ? outcome.q2Target : parseFloat(outcome.q2Target as string),
      q3Target: typeof outcome.q3Target === 'number' ? outcome.q3Target : parseFloat(outcome.q3Target as string),
      q4Target: typeof outcome.q4Target === 'number' ? outcome.q4Target : parseFloat(outcome.q4Target as string),
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
            <p className="text-gray-900 font-medium mb-1">
              {isEditing && canEditDetails ? editedData.description : outcome.description}
            </p>

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
                  {formatValue(
                    isEditing && canEditDetails ? editedData.annualTarget : outcome.annualTarget,
                    isEditing && canEditDetails ? editedData.unit : outcome.unit
                  )}
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

          {/* Outcome Details Editor - Only for executives and department heads */}
          {isEditing && canEditDetails && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-3">Edit Outcome Details</h4>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editedData.description}
                  onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {editedData.description.length}/200 characters
                </p>
              </div>

              {/* Unit Selector */}
              <div className="mb-3">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="unit"
                  value={editedData.unit}
                  onChange={(e) => setEditedData({ ...editedData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="count">Count</option>
                  <option value="USD">USD</option>
                  <option value="percentage">Percentage</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>

              {/* Targets Grid */}
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <label htmlFor="annualTarget" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Target
                  </label>
                  <input
                    id="annualTarget"
                    type="number"
                    value={editedData.annualTarget}
                    onChange={(e) => setEditedData({ ...editedData, annualTarget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="q1Target" className="block text-sm font-medium text-gray-700 mb-1">
                    Q1 Target
                  </label>
                  <input
                    id="q1Target"
                    type="number"
                    value={editedData.q1Target}
                    onChange={(e) => setEditedData({ ...editedData, q1Target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="q2Target" className="block text-sm font-medium text-gray-700 mb-1">
                    Q2 Target
                  </label>
                  <input
                    id="q2Target"
                    type="number"
                    value={editedData.q2Target}
                    onChange={(e) => setEditedData({ ...editedData, q2Target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="q3Target" className="block text-sm font-medium text-gray-700 mb-1">
                    Q3 Target
                  </label>
                  <input
                    id="q3Target"
                    type="number"
                    value={editedData.q3Target}
                    onChange={(e) => setEditedData({ ...editedData, q3Target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="q4Target" className="block text-sm font-medium text-gray-700 mb-1">
                    Q4 Target
                  </label>
                  <input
                    id="q4Target"
                    type="number"
                    value={editedData.q4Target}
                    onChange={(e) => setEditedData({ ...editedData, q4Target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-blue-600">
                Note: Changes to targets will be saved when you click "Save" above
              </p>
            </div>
          )}

          {/* Quarter Cards */}
          <div className="grid grid-cols-4 gap-3">
            <QuarterCardEditable
              quarter="Q1"
              target={isEditing && canEditDetails ? editedData.q1Target : outcome.q1Target}
              actual={editedData.q1Actual}
              status={editedData.q1Status}
              unit={isEditing && canEditDetails ? editedData.unit : outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q1Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q1Status: status })}
            />
            <QuarterCardEditable
              quarter="Q2"
              target={isEditing && canEditDetails ? editedData.q2Target : outcome.q2Target}
              actual={editedData.q2Actual}
              status={editedData.q2Status}
              unit={isEditing && canEditDetails ? editedData.unit : outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q2Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q2Status: status })}
            />
            <QuarterCardEditable
              quarter="Q3"
              target={isEditing && canEditDetails ? editedData.q3Target : outcome.q3Target}
              actual={editedData.q3Actual}
              status={editedData.q3Status}
              unit={isEditing && canEditDetails ? editedData.unit : outcome.unit}
              isEditing={isEditing}
              onActualChange={(value) => setEditedData({ ...editedData, q3Actual: value })}
              onStatusChange={(status) => setEditedData({ ...editedData, q3Status: status })}
            />
            <QuarterCardEditable
              quarter="Q4"
              target={isEditing && canEditDetails ? editedData.q4Target : outcome.q4Target}
              actual={editedData.q4Actual}
              status={editedData.q4Status}
              unit={isEditing && canEditDetails ? editedData.unit : outcome.unit}
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
