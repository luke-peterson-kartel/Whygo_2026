import { useState } from 'react';
import { CheckCircle, Archive, XCircle, AlertCircle } from 'lucide-react';
import { WhyGOStatus } from '@/types/whygo.types';
import { useUpdateWhyGOStatus } from '@/hooks/useUpdateWhyGOStatus';
import { useDevMode } from '@/hooks/useDevMode';

interface StatusChangeButtonProps {
  whygoId: string;
  currentStatus: WhyGOStatus;
  whygoLevel: 'company' | 'department' | 'individual';
  whygoDepartment?: string | null;
  onStatusChanged?: () => void;
}

export function StatusChangeButton({
  whygoId,
  currentStatus,
  whygoLevel,
  whygoDepartment,
  onStatusChanged,
}: StatusChangeButtonProps) {
  const { user } = useDevMode();
  const { updateStatus, loading, error } = useUpdateWhyGOStatus();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WhyGOStatus | null>(null);

  // Permission check:
  // - Executives can change status for ALL WhyGOs
  // - Department heads can change status for their own department's WhyGOs
  if (!user) return null;

  const isExecutive = user.level === 'executive';
  const isDepartmentHead = user.level === 'department_head';
  const isOwnDepartment = isDepartmentHead && whygoLevel === 'department' && user.department === whygoDepartment;

  if (!isExecutive && !isOwnDepartment) {
    return null;
  }

  const handleStatusClick = (newStatus: WhyGOStatus) => {
    setSelectedStatus(newStatus);
    setShowConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStatus) return;

    const result = await updateStatus({
      whygoId,
      newStatus: selectedStatus,
      whygoLevel,
      whygoDepartment,
    });

    if (result.success) {
      setShowConfirm(false);
      setSelectedStatus(null);
      onStatusChanged?.();
    }
  };

  const cancelStatusChange = () => {
    setShowConfirm(false);
    setSelectedStatus(null);
  };

  // Define available status transitions based on current status
  const getAvailableTransitions = () => {
    switch (currentStatus) {
      case 'draft':
        return [
          { status: 'active' as WhyGOStatus, label: 'Activate', icon: CheckCircle, color: 'green' },
          { status: 'archived' as WhyGOStatus, label: 'Archive', icon: Archive, color: 'purple' },
        ];
      case 'active':
        return [
          { status: 'completed' as WhyGOStatus, label: 'Complete', icon: CheckCircle, color: 'blue' },
          { status: 'archived' as WhyGOStatus, label: 'Archive', icon: Archive, color: 'purple' },
        ];
      case 'completed':
        return [
          { status: 'archived' as WhyGOStatus, label: 'Archive', icon: Archive, color: 'purple' },
        ];
      case 'archived':
        return [
          { status: 'active' as WhyGOStatus, label: 'Reactivate', icon: CheckCircle, color: 'green' },
        ];
      default:
        return [];
    }
  };

  const transitions = getAvailableTransitions();

  if (transitions.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Status Change Buttons */}
      {!showConfirm && (
        <div className="flex gap-2">
          {transitions.map(({ status, label, icon: Icon, color }) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              disabled={loading}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium
                transition-colors border
                ${color === 'green' && 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}
                ${color === 'blue' && 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}
                ${color === 'purple' && 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'}
                ${loading && 'opacity-50 cursor-not-allowed'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && selectedStatus && (
        <div className="absolute top-0 right-0 z-10 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 min-w-[280px]">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Confirm Status Change
              </p>
              <p className="text-xs text-gray-600">
                Change status from <span className="font-semibold">{currentStatus}</span> to{' '}
                <span className="font-semibold">{selectedStatus}</span>?
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={cancelStatusChange}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusChange}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
