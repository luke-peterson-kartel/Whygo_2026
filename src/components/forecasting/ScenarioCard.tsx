import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/forecastCalculations';
import { WHYGO_QUARTERLY_TARGETS } from '@/types/forecasting.types';
import type { ForecastingScenario, ScenarioType } from '@/types/forecasting.types';

interface ScenarioCardProps {
  scenario: ForecastingScenario;
  onLoad: (scenario: ForecastingScenario) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

const TYPE_STYLES: Record<ScenarioType, { bg: string; text: string; label: string }> = {
  baseline: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Baseline' },
  optimistic: { bg: 'bg-green-100', text: 'text-green-700', label: 'Optimistic' },
  conservative: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Conservative' },
  custom: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Custom' },
};

export function ScenarioCard({ scenario, onLoad, onDelete, isSelected }: ScenarioCardProps) {
  const typeStyle = TYPE_STYLES[scenario.type];
  const variance = scenario.outputs.annualRevenue - WHYGO_QUARTERLY_TARGETS.q4;
  const isAboveTarget = variance >= 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete scenario "${scenario.name}"?`)) {
      onDelete(scenario.id);
    }
  };

  return (
    <div
      onClick={() => onLoad(scenario)}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{scenario.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
              {typeStyle.label}
            </span>
          </div>
          {scenario.description && (
            <p className="text-xs text-gray-500 truncate">{scenario.description}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete scenario"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Revenue */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(scenario.outputs.annualRevenue)}
        </p>
        <p className={`text-xs flex items-center gap-1 ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
          {isAboveTarget ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isAboveTarget ? '+' : ''}{formatCurrency(variance)} vs $7M target
        </p>
      </div>

      {/* Quarterly Mini Chart */}
      <div className="flex items-end gap-1 h-8 mb-3">
        {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter) => {
          const revenue = scenario.outputs.quarterlyRevenue[quarter];
          const maxRevenue = Math.max(...Object.values(scenario.outputs.quarterlyRevenue));
          const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
          return (
            <div key={quarter} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-indigo-400 rounded-t transition-all"
                style={{ height: `${heightPercent}%`, minHeight: revenue > 0 ? '2px' : '0' }}
              />
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-900">{scenario.outputs.totalSpecs}</p>
          <p className="text-xs text-gray-500">Specs</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{scenario.outputs.totalConversions}</p>
          <p className="text-xs text-gray-500">Converts</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{Math.round(scenario.inputs.conversionRate * 100)}%</p>
          <p className="text-xs text-gray-500">Rate</p>
        </div>
      </div>

      {/* Load indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
      )}
    </div>
  );
}
