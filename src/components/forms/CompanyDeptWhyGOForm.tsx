import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateWhyGO } from '@/hooks/useCreateWhyGO';
import { WhyGOFormData, OutcomeFormData, validateWhyGOForm } from '@/lib/utils/validation';
import { PermissionService } from '@/lib/utils/permissions';
import { FormSection } from './FormSection';
import { LevelSelector } from './LevelSelector';
import { DepartmentSelector } from './DepartmentSelector';
import { WhyTextarea } from './WhyTextarea';
import { GoalTextarea } from './GoalTextarea';
import { OutcomeFormItem } from './OutcomeFormItem';
import { FormActions } from './FormActions';
import { GuidancePanel } from './GuidancePanel';

export function CompanyDeptWhyGOForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createWhyGO, creating } = useCreateWhyGO();

  const [formData, setFormData] = useState<WhyGOFormData>({
    level: 'company',
    department: null,
    why: '',
    goal: '',
    outcomes: [],
  });

  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Check permissions for current level
  const hasPermission = user ? PermissionService.canCreateWhyGO(user as any, formData.level) : false;

  const handleLevelChange = (level: 'company' | 'department' | 'individual') => {
    setFormData({ ...formData, level, department: level === 'department' ? formData.department : null });
  };

  const handleAddOutcome = () => {
    const newOutcome: OutcomeFormData = {
      description: '',
      annualTarget: '',
      unit: '',
      q1Target: '',
      q2Target: '',
      q3Target: '',
      q4Target: '',
      ownerId: user?.email || '',
      ownerName: user?.name || '',
      sortOrder: formData.outcomes.length + 1,
    };
    setFormData({ ...formData, outcomes: [...formData.outcomes, newOutcome] });
  };

  const handleRemoveOutcome = (index: number) => {
    const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
    setFormData({ ...formData, outcomes: newOutcomes });
  };

  const handleOutcomeChange = (index: number, outcome: OutcomeFormData) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = outcome;
    setFormData({ ...formData, outcomes: newOutcomes });
  };

  const handleSubmitClick = () => {
    if (!user) {
      setSubmitError('You must be logged in to create WhyGOs');
      return;
    }

    // Validate first
    setValidationErrors([]);
    setSubmitError(null);

    const errors = validateWhyGOForm(formData);

    if (errors.length > 0) {
      // Validation failed, show errors
      setValidationErrors(errors);
      setSubmitError('Please fix validation errors before submitting');
    } else {
      // Validation passed, show confirmation dialog
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!user) return;

    const result = await createWhyGO(formData, user as any);

    if (result.success) {
      setShowConfirmDialog(false);
      // Success! Redirect to my goals page (user requested all goals redirect to /my-goals)
      navigate('/my-goals');
    } else {
      setShowConfirmDialog(false);
      if (result.validationErrors) {
        setValidationErrors(result.validationErrors);
      }
      if (result.error) {
        setSubmitError(result.error);
      }
    }
  };

  const getFieldError = (field: string) => {
    const error = validationErrors.find((e) => e.field === field);
    return error?.message;
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">You must be logged in to create WhyGOs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create WhyGO</h1>
        <p className="text-gray-600 mt-2">
          Define strategic goals for your {formData.level === 'company' ? 'organization' : 'department'}.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error banner */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{submitError}</p>
          </div>
        )}

        {/* Permission warning */}
        {!hasPermission && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Permission Required</h3>
              <p className="text-sm text-yellow-800 mt-1">
                You don't have permission to create {formData.level}-level WhyGOs.
                {formData.level !== 'individual' && ' Try creating an individual WhyGO instead.'}
              </p>
            </div>
          </div>
        )}

        {/* Guidance */}
        <GuidancePanel
          title={`Tips for Creating ${formData.level === 'company' ? 'Company' : 'Department'} WhyGOs`}
          tips={
            formData.level === 'company'
              ? [
                  'Company goals should align with the overall business strategy',
                  'Be ambitious but realistic with annual targets',
                  'Ensure outcomes are measurable and time-bound',
                  'Department goals should cascade from these company goals',
                ]
              : [
                  'Department goals should support company-level objectives',
                  'Focus on what your department can directly impact',
                  'Coordinate with other departments where goals overlap',
                  'Individual goals should cascade from these department goals',
                ]
          }
        />

        {/* Level Selector */}
        <FormSection
          title="WhyGO Level"
          description="Select the scope of this goal"
          required
        >
          <LevelSelector
            value={formData.level}
            onChange={handleLevelChange}
            disabled={creating}
          />
          {getFieldError('level') && (
            <p className="text-sm text-red-600 mt-2">{getFieldError('level')}</p>
          )}
        </FormSection>

        {/* Department Selector (conditional) */}
        {formData.level === 'department' && (
          <FormSection
            title="Department"
            description="Select the department for this goal"
            required
          >
            <DepartmentSelector
              value={formData.department}
              onChange={(dept) => setFormData({ ...formData, department: dept })}
              disabled={creating}
              required
            />
            {getFieldError('department') && (
              <p className="text-sm text-red-600 mt-2">{getFieldError('department')}</p>
            )}
          </FormSection>
        )}

        {/* WHY Statement */}
        <FormSection
          title="WHY Statement"
          description="Explain the purpose and importance of this goal"
          required
        >
          <WhyTextarea
            value={formData.why}
            onChange={(value) => setFormData({ ...formData, why: value })}
            error={getFieldError('why')}
            disabled={creating}
          />
        </FormSection>

        {/* GOAL Statement */}
        <FormSection
          title="GOAL Statement"
          description="State the specific, measurable goal"
          required
        >
          <GoalTextarea
            value={formData.goal}
            onChange={(value) => setFormData({ ...formData, goal: value })}
            error={getFieldError('goal')}
            disabled={creating}
          />
        </FormSection>

        {/* Outcomes */}
        <FormSection
          title="Outcomes"
          description="Define measurable outcomes that will demonstrate achievement"
          required
        >
          <div className="space-y-4">
            {formData.outcomes.map((outcome, index) => (
              <OutcomeFormItem
                key={index}
                outcome={outcome}
                index={index}
                onChange={(updated) => handleOutcomeChange(index, updated)}
                onRemove={() => handleRemoveOutcome(index)}
                canRemove={formData.outcomes.length > 1}
                disabled={creating}
              />
            ))}

            <button
              type="button"
              onClick={handleAddOutcome}
              disabled={creating || formData.outcomes.length >= 10}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Outcome {formData.outcomes.length >= 10 && '(Maximum 10)'}
            </button>

            {getFieldError('outcomes') && (
              <p className="text-sm text-red-600">{getFieldError('outcomes')}</p>
            )}
          </div>
        </FormSection>

        {/* Form Actions */}
        <FormActions
          onSubmit={handleSubmitClick}
          onCancel={() => navigate(-1)}
          submitLabel="Create WhyGO"
          loading={creating}
          disabled={creating || !hasPermission}
        />
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create WhyGO?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to create this {formData.level} WhyGO? This will create your goal
              with {formData.outcomes.length} outcome{formData.outcomes.length !== 1 ? 's' : ''}.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create WhyGO'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
