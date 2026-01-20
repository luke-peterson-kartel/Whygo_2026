import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateWhyGO } from '@/hooks/useCreateWhyGO';
import { WhyGOFormData, OutcomeFormData, validateWhyGOForm } from '@/lib/utils/validation';
import { ContextSidebar } from './context/ContextSidebar';
import { FormSection } from './FormSection';
import { WhyTextarea } from './WhyTextarea';
import { GoalTextarea } from './GoalTextarea';
import { OutcomeFormItem } from './OutcomeFormItem';
import { FormActions } from './FormActions';
import { GuidancePanel } from './GuidancePanel';

export function IndividualWhyGOForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createWhyGO, creating } = useCreateWhyGO();

  const [formData, setFormData] = useState<WhyGOFormData>({
    level: 'individual',
    department: null,
    why: '',
    goal: '',
    outcomes: [],
  });

  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
      // Success! Redirect to my goals page
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">You must be logged in to create WhyGOs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Your 2026 WhyGOs</h1>
        <p className="text-gray-600 mt-2">
          Set your individual goals for the year. Reference the context panel for guidance.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Context (30%) */}
        <div className="lg:col-span-1">
          <ContextSidebar userEmail={user.email} />
        </div>

        {/* Right form area (70%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error banner */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{submitError}</p>
            </div>
          )}

          {/* Guidance */}
          <GuidancePanel
            title="Tips for Creating Individual WhyGOs"
            tips={[
              'Your WhyGOs should support your department and company goals',
              'Be specific and measurable in your outcomes',
              'Focus on what you can directly control or influence',
              'Align your metrics with suggested KPIs when appropriate',
            ]}
          />

          {/* WHY Statement */}
          <FormSection
            title="WHY Statement"
            description="Explain the purpose and importance of your goals"
            required
          >
            <WhyTextarea
              value={formData.why}
              onChange={(value) => setFormData({ ...formData, why: value })}
              error={getFieldError('why')}
            />
          </FormSection>

          {/* GOAL Statement */}
          <FormSection
            title="GOAL Statement"
            description="State your specific, measurable goals for 2026"
            required
          >
            <GoalTextarea
              value={formData.goal}
              onChange={(value) => setFormData({ ...formData, goal: value })}
              error={getFieldError('goal')}
            />
          </FormSection>

          {/* Outcomes */}
          <FormSection
            title="Outcomes"
            description="Define measurable outcomes that will demonstrate achievement of your goals"
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
                />
              ))}

              <button
                type="button"
                onClick={handleAddOutcome}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Outcome
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
            disabled={creating}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create WhyGO?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to create this WhyGO? This will create your goal
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
