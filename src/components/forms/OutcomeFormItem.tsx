import { Trash2 } from 'lucide-react';
import { OutcomeFormData } from '@/lib/utils/validation';
import { UnitSelector } from './UnitSelector';
import { EmployeeSelector } from './EmployeeSelector';
import { QuarterlyTargetInputs } from './QuarterlyTargetInputs';

interface OutcomeFormItemProps {
  outcome: OutcomeFormData;
  index: number;
  onChange: (outcome: OutcomeFormData) => void;
  onRemove: () => void;
  disabled?: boolean;
  canRemove?: boolean;
}

export function OutcomeFormItem({
  outcome,
  index,
  onChange,
  onRemove,
  disabled = false,
  canRemove = true,
}: OutcomeFormItemProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 space-y-4 bg-white">
      {/* Header with remove button */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Outcome {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor={`outcome-${index}-description`} className="block text-sm font-medium text-gray-700 mb-2">
          Description
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id={`outcome-${index}-description`}
          type="text"
          value={outcome.description}
          onChange={(e) => onChange({ ...outcome, description: e.target.value })}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="e.g., Enterprise clients signed (total)"
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">{outcome.description.length} / 200</p>
      </div>

      {/* Annual Target and Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`outcome-${index}-annual`} className="block text-sm font-medium text-gray-700 mb-2">
            Annual Target
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id={`outcome-${index}-annual`}
            type={outcome.unit === 'text' ? 'text' : 'number'}
            value={outcome.annualTarget}
            onChange={(e) => onChange({ ...outcome, annualTarget: e.target.value })}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label htmlFor={`outcome-${index}-unit`} className="block text-sm font-medium text-gray-700 mb-2">
            Unit
            <span className="text-red-500 ml-1">*</span>
          </label>
          <UnitSelector
            value={outcome.unit}
            onChange={(unit) => onChange({ ...outcome, unit })}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Quarterly Targets (only for numeric units) */}
      {outcome.unit !== 'text' && (
        <QuarterlyTargetInputs
          annualTarget={outcome.annualTarget}
          q1={outcome.q1Target}
          q2={outcome.q2Target}
          q3={outcome.q3Target}
          q4={outcome.q4Target}
          onQ1Change={(value) => onChange({ ...outcome, q1Target: value })}
          onQ2Change={(value) => onChange({ ...outcome, q2Target: value })}
          onQ3Change={(value) => onChange({ ...outcome, q3Target: value })}
          onQ4Change={(value) => onChange({ ...outcome, q4Target: value })}
          disabled={disabled}
          unit={outcome.unit}
        />
      )}

      {/* Owner */}
      <div>
        <label htmlFor={`outcome-${index}-owner`} className="block text-sm font-medium text-gray-700 mb-2">
          Owner
          <span className="text-red-500 ml-1">*</span>
        </label>
        <EmployeeSelector
          value={outcome.ownerId}
          onChange={(id, name) => onChange({ ...outcome, ownerId: id, ownerName: name })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
