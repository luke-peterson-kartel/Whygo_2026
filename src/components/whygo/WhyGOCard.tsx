import { useState } from 'react';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { OutcomeRow } from './OutcomeRow';
import { SupportingDepartmentGoals } from './SupportingDepartmentGoals';
import { StatusChangeButton } from './StatusChangeButton';
import { Target, User, Calendar, Edit2, Trash2, ChevronDown, ChevronRight, ListChecks } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateWhyGO } from '@/hooks/useUpdateWhyGO';
import { useDeleteWhyGO } from '@/hooks/useDeleteWhyGO';
import { PermissionService } from '@/lib/utils/permissions';

interface WhyGOCardProps {
  whygo: WhyGOWithOutcomes;
  number?: number;
  showOwner?: boolean;
  refetch?: () => void;
}

export function WhyGOCard({ whygo, number, showOwner = false, refetch }: WhyGOCardProps) {
  const { user } = useAuth();
  const { updateWhyGO, updating } = useUpdateWhyGO();
  const { deleteWhyGO, deleting } = useDeleteWhyGO();

  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(whygo.goal);
  const [editedWhy, setEditedWhy] = useState(whygo.why);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [outcomesExpanded, setOutcomesExpanded] = useState(false);

  const canEdit = user && PermissionService.canEditWhyGO(user as any, whygo);
  const canDelete = user && PermissionService.canDeleteWhyGO(user as any, whygo);

  const calculateOutcomesStatus = () => {
    if (whygo.outcomes.length === 0) {
      return { currentQuarter: 'Q1', onTrack: 0, atRisk: 0, offTrack: 0, notStarted: 0, total: 0 };
    }

    // Determine current quarter based on date
    const month = new Date().getMonth();
    const currentQuarter = month < 3 ? 'Q1' : month < 6 ? 'Q2' : month < 9 ? 'Q3' : 'Q4';
    const statusKey = `${currentQuarter.toLowerCase()}Status` as 'q1Status' | 'q2Status' | 'q3Status' | 'q4Status';

    let onTrack = 0, atRisk = 0, offTrack = 0, notStarted = 0;

    whygo.outcomes.forEach(outcome => {
      const status = outcome[statusKey];
      if (status === '+') onTrack++;
      else if (status === '~') atRisk++;
      else if (status === '-') offTrack++;
      else notStarted++;
    });

    return { currentQuarter, onTrack, atRisk, offTrack, notStarted, total: whygo.outcomes.length };
  };

  const outcomesStatus = calculateOutcomesStatus();

  const handleEdit = () => {
    setEditedGoal(whygo.goal);
    setEditedWhy(whygo.why);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;

    const result = await updateWhyGO(
      whygo,
      { goal: editedGoal, why: editedWhy },
      user
    );

    if (result.success) {
      setIsEditing(false);
      if (refetch) refetch();
    } else {
      alert(result.error || 'Failed to update WhyGO');
    }
  };

  const handleCancel = () => {
    setEditedGoal(whygo.goal);
    setEditedWhy(whygo.why);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!user) return;

    const result = await deleteWhyGO(whygo, user);

    if (result.success) {
      if (refetch) refetch();
    } else {
      alert(result.error || 'Failed to delete WhyGO');
    }

    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {number && (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3">
                <Target className="w-4 h-4" />
                <span>WhyGO #{number}</span>
              </div>
            )}
            {isEditing ? (
              <textarea
                value={editedGoal}
                onChange={(e) => setEditedGoal(e.target.value)}
                className="w-full bg-white/20 text-white text-2xl font-bold rounded p-2 mb-3 placeholder-white/60 resize-none overflow-hidden"
                rows={Math.max(2, Math.ceil(editedGoal.length / 50))}
                placeholder="Enter goal statement..."
              />
            ) : (
              <h3 className="text-2xl font-bold mb-3">{whygo.goal}</h3>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              {showOwner && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{whygo.ownerName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{whygo.year}</span>
              </div>
              {whygo.department && (
                <div className="px-2 py-1 bg-white/20 rounded-full">
                  {whygo.department}
                </div>
              )}
            </div>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <StatusBadge status={whygo.status} />

            {canEdit && !isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Edit Goal and Why"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {canDelete && !isEditing && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                title="Delete WhyGO"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* WHY Statement */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
              WHY
            </div>
          </div>
          {isEditing ? (
            <textarea
              value={editedWhy}
              onChange={(e) => setEditedWhy(e.target.value)}
              className="flex-1 text-gray-800 leading-relaxed rounded p-2 border border-blue-300 resize-none overflow-hidden"
              rows={Math.max(4, Math.ceil(editedWhy.length / 80))}
              placeholder="Enter why statement..."
            />
          ) : (
            <p className="text-gray-800 leading-relaxed">{whygo.why}</p>
          )}
        </div>
      </div>

      {/* Save/Cancel buttons when editing */}
      {isEditing && (
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            disabled={updating}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Outcomes - Collapsible */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setOutcomesExpanded(!outcomesExpanded)}
          className="w-full p-4 hover:bg-green-50/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">Outcomes</h4>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {whygo.outcomes.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Current quarter status summary */}
              <span className="text-sm text-gray-600">
                {outcomesStatus.currentQuarter}: {outcomesStatus.onTrack}/{outcomesStatus.total} on track
              </span>
              {/* Overall status badge */}
              {outcomesStatus.total > 0 && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  outcomesStatus.offTrack > 0 ? 'bg-red-100 text-red-700' :
                  outcomesStatus.atRisk > 0 ? 'bg-yellow-100 text-yellow-700' :
                  outcomesStatus.onTrack > 0 ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {outcomesStatus.offTrack > 0 ? 'Off Track' :
                   outcomesStatus.atRisk > 0 ? 'At Risk' :
                   outcomesStatus.onTrack > 0 ? 'On Track' :
                   'Not Started'}
                </span>
              )}
              {outcomesExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
          {/* Segmented status bar */}
          {outcomesStatus.total > 0 && (
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
              {outcomesStatus.onTrack > 0 && (
                <div className="h-full bg-green-500" style={{ width: `${(outcomesStatus.onTrack / outcomesStatus.total) * 100}%` }} />
              )}
              {outcomesStatus.atRisk > 0 && (
                <div className="h-full bg-yellow-500" style={{ width: `${(outcomesStatus.atRisk / outcomesStatus.total) * 100}%` }} />
              )}
              {outcomesStatus.offTrack > 0 && (
                <div className="h-full bg-red-500" style={{ width: `${(outcomesStatus.offTrack / outcomesStatus.total) * 100}%` }} />
              )}
              {outcomesStatus.notStarted > 0 && (
                <div className="h-full bg-gray-400" style={{ width: `${(outcomesStatus.notStarted / outcomesStatus.total) * 100}%` }} />
              )}
            </div>
          )}
        </button>

        {outcomesExpanded && (
          <div className="px-4 pb-4">
            {whygo.outcomes.length === 0 ? (
              <p className="text-gray-600 italic">No outcomes defined yet.</p>
            ) : (
              <div className="space-y-4">
                {whygo.outcomes.map((outcome, index) => (
                  <OutcomeRow
                    key={outcome.id}
                    outcome={outcome}
                    number={index + 1}
                    whygoId={whygo.id}
                    refetch={refetch || (() => {})}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Supporting Department Goals - Only for Company Level (moved below Outcomes) */}
      {whygo.level === 'company' && (
        <div className="p-4 border-b border-gray-200">
          <SupportingDepartmentGoals companyGoal={whygo.goal} />
        </div>
      )}

      {/* Status Change Controls - Hidden for cleaner UI */}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete WhyGO?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this WhyGO? This will permanently remove
              the goal, why statement, and all {whygo.outcomes.length} outcome(s).
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete WhyGO'}
              </button>
            </div>
          </div>
        </div>
      )}
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
