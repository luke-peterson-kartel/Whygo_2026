import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { ScenarioInputs, ScenarioType } from '@/types/forecasting.types';

interface SaveScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; type: ScenarioType }) => Promise<void>;
  inputs: ScenarioInputs;
  saving: boolean;
}

export function SaveScenarioModal({ isOpen, onClose, onSave, inputs, saving }: SaveScenarioModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ScenarioType>('custom');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a scenario name');
      return;
    }

    try {
      await onSave({ name, description, type });
      // Reset form
      setName('');
      setDescription('');
      setType('custom');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scenario');
    }
  };

  const totalSpecs = Object.values(inputs.specsPerMonth).reduce((sum, v) => sum + v, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Save Scenario</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Scenario Summary */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-700 mb-2">Scenario Parameters</p>
              <div className="grid grid-cols-3 gap-2 text-gray-600">
                <div>Total Specs: {totalSpecs}</div>
                <div>Conversion: {Math.round(inputs.conversionRate * 100)}%</div>
                <div>Avg Fee: ${inputs.avgMonthlyFee.toLocaleString()}</div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Optimistic Q3 Ramp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ScenarioType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="baseline">Baseline</option>
                <option value="optimistic">Optimistic</option>
                <option value="conservative">Conservative</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief notes about this scenario..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Scenario
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
