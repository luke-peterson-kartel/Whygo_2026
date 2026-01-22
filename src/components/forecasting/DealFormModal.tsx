import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { STAGE_CONFIG, STAGE_PROBABILITIES } from '@/types/forecasting.types';
import type { DealStage, PipelineDeal } from '@/types/forecasting.types';
import { Timestamp } from 'firebase/firestore';

interface DealFormData {
  companyName: string;
  contactName: string;
  stage: DealStage;
  probability: number;
  monthlyFee: number;
  specSignedDate: string; // ISO date string for input
  expectedConversionDate: string;
  notes: string;
}

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<PipelineDeal, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deal?: PipelineDeal | null; // If provided, edit mode
}

const STAGES: DealStage[] = ['prospect', 'spec_signed', 'in_spec', 'decision', 'converted', 'lost'];

function timestampToDateString(ts: Timestamp | null): string {
  if (!ts) return '';
  const date = ts.toDate();
  return date.toISOString().split('T')[0];
}

export function DealFormModal({ isOpen, onClose, onSave, deal }: DealFormModalProps) {
  const [formData, setFormData] = useState<DealFormData>({
    companyName: '',
    contactName: '',
    stage: 'prospect',
    probability: STAGE_PROBABILITIES.prospect,
    monthlyFee: 75000,
    specSignedDate: '',
    expectedConversionDate: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens or deal changes
  useEffect(() => {
    if (isOpen) {
      if (deal) {
        // Edit mode - populate form with deal data
        setFormData({
          companyName: deal.companyName,
          contactName: deal.contactName,
          stage: deal.stage,
          probability: deal.probability,
          monthlyFee: deal.monthlyFee,
          specSignedDate: timestampToDateString(deal.specSignedDate),
          expectedConversionDate: timestampToDateString(deal.expectedConversionDate),
          notes: deal.notes,
        });
      } else {
        // Add mode - reset to defaults
        setFormData({
          companyName: '',
          contactName: '',
          stage: 'prospect',
          probability: STAGE_PROBABILITIES.prospect,
          monthlyFee: 75000,
          specSignedDate: '',
          expectedConversionDate: '',
          notes: '',
        });
      }
      setError(null);
    }
  }, [isOpen, deal]);

  // Update probability when stage changes (unless user has customized it)
  const handleStageChange = (newStage: DealStage) => {
    setFormData(prev => ({
      ...prev,
      stage: newStage,
      probability: STAGE_PROBABILITIES[newStage],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return;
    }

    if (formData.monthlyFee <= 0) {
      setError('Monthly fee must be greater than 0');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        companyName: formData.companyName.trim(),
        contactName: formData.contactName.trim(),
        stage: formData.stage,
        probability: formData.probability,
        monthlyFee: formData.monthlyFee,
        specSignedDate: formData.specSignedDate
          ? Timestamp.fromDate(new Date(formData.specSignedDate))
          : null,
        expectedConversionDate: formData.expectedConversionDate
          ? Timestamp.fromDate(new Date(formData.expectedConversionDate))
          : null,
        notes: formData.notes,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save deal');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!deal;
  const acv = formData.monthlyFee * 12;
  const weightedValue = acv * (formData.probability / 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'Edit Deal' : 'Add New Deal'}
            </h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Acme Corp"
                autoFocus
              />
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Jane Smith"
              />
            </div>

            {/* Stage */}
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                id="stage"
                value={formData.stage}
                onChange={(e) => handleStageChange(e.target.value as DealStage)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_CONFIG[stage].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Fee & Probability Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="monthlyFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Fee *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="monthlyFee"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    step="5000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="probability" className="block text-sm font-medium text-gray-700 mb-1">
                  Probability
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="probability"
                    value={formData.probability}
                    onChange={(e) => setFormData(prev => ({ ...prev, probability: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Value Preview */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>ACV: <span className="font-semibold text-gray-900">${acv.toLocaleString()}</span></div>
                <div>Weighted: <span className="font-semibold text-indigo-600">${Math.round(weightedValue).toLocaleString()}</span></div>
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="specSignedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Spec Signed Date
                </label>
                <input
                  type="date"
                  id="specSignedDate"
                  value={formData.specSignedDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, specSignedDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="expectedConversionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Conversion
                </label>
                <input
                  type="date"
                  id="expectedConversionDate"
                  value={formData.expectedConversionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedConversionDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Any additional notes about this deal..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Deal')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
