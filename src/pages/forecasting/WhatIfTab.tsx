import { useState, useMemo } from 'react';
import { Calculator, Save, RefreshCw } from 'lucide-react';
import { calculateForecast, formatCurrency, formatPercent } from '@/lib/utils/forecastCalculations';
import { DEFAULT_SCENARIO_INPUTS } from '@/types/forecasting.types';
import { useForecastingScenarios } from '@/hooks/useForecastingScenarios';
import { useDevMode } from '@/hooks/useDevMode';
import { useSalesConfig } from '@/hooks/useSalesConfig';
import { SaveScenarioModal } from '@/components/forecasting/SaveScenarioModal';
import { ScenarioCard } from '@/components/forecasting/ScenarioCard';
import type { ScenarioInputs, ForecastingScenario, ScenarioType, MonthlySpecs } from '@/types/forecasting.types';

// Short month labels for compact display
const MONTH_KEYS: Array<keyof MonthlySpecs> = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_SHORT_LABELS: Record<keyof MonthlySpecs, string> = {
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', may: 'May', jun: 'Jun',
  jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
};

export function WhatIfTab() {
  const { user } = useDevMode();
  const [inputs, setInputs] = useState<ScenarioInputs>(DEFAULT_SCENARIO_INPUTS);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const { eoyRevenueTarget, totalSpecsTarget } = useSalesConfig(2026);

  const {
    scenarios,
    loading: scenariosLoading,
    error: scenariosError,
    createScenario,
    deleteScenario,
    creating,
    refetch,
  } = useForecastingScenarios({ year: 2026 }, user ? { email: user.email, name: user.name } : undefined);

  // Calculate outputs whenever inputs change
  const outputs = useMemo(() => calculateForecast(inputs), [inputs]);

  // Calculate variance from WhyGO target (single source of truth)
  const targetVariance = outputs.annualRevenue - eoyRevenueTarget;
  const isAboveTarget = targetVariance >= 0;

  // Calculate total specs
  const totalSpecs = MONTH_KEYS.reduce((sum, month) => sum + inputs.specsPerMonth[month], 0);

  const updateSpecsForMonth = (month: keyof MonthlySpecs, value: number) => {
    setInputs(prev => ({
      ...prev,
      specsPerMonth: {
        ...prev.specsPerMonth,
        [month]: value,
      },
    }));
    setSelectedScenarioId(null);
  };

  const handleSaveScenario = async (data: { name: string; description: string; type: ScenarioType }) => {
    const result = await createScenario({
      name: data.name,
      description: data.description,
      type: data.type,
      inputs,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to save scenario');
    }
  };

  const handleLoadScenario = (scenario: ForecastingScenario) => {
    setInputs(scenario.inputs);
    setSelectedScenarioId(scenario.id);
  };

  const handleDeleteScenario = async (id: string) => {
    await deleteScenario(id);
    if (selectedScenarioId === id) {
      setSelectedScenarioId(null);
    }
  };

  const handleResetToDefault = () => {
    setInputs(DEFAULT_SCENARIO_INPUTS);
    setSelectedScenarioId(null);
  };

  return (
    <div className="space-y-4">
      {/* Scenario Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs Panel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Scenario Inputs</h3>
            </div>
            <button
              onClick={handleResetToDefault}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              title="Reset to baseline"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Specs per Month */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Specs Closing by Month
            </label>
            <div className="grid grid-cols-6 gap-2">
              {MONTH_KEYS.map((month) => (
                <div key={month} className="text-center">
                  <label className="block text-xs text-gray-500 mb-1">
                    {MONTH_SHORT_LABELS[month]}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={inputs.specsPerMonth[month]}
                    onChange={(e) => updateSpecsForMonth(month, Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2 py-1 text-center text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Total: {totalSpecs} specs (WhyGO target: {totalSpecsTarget}). Specs convert 2 months after closing.
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Conversion Rate
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.conversionRate * 100}
                onChange={(e) => {
                  setInputs(prev => ({ ...prev, conversionRate: parseInt(e.target.value) / 100 }));
                  setSelectedScenarioId(null);
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-12 text-sm font-semibold text-gray-900 text-right">
                {formatPercent(inputs.conversionRate)}
              </span>
            </div>
            <p className="text-xs text-gray-500">WhyGO target: 75%</p>
          </div>

          {/* Average Monthly Fee */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Average Monthly Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.avgMonthlyFee}
                onChange={(e) => {
                  setInputs(prev => ({ ...prev, avgMonthlyFee: parseInt(e.target.value) || 0 }));
                  setSelectedScenarioId(null);
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                step="5000"
              />
            </div>
            <p className="text-xs text-gray-500">Target: $75,000/month</p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Projected Outcome</h3>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              onClick={() => setShowSaveModal(true)}
            >
              <Save className="w-4 h-4" />
              Save Scenario
            </button>
          </div>

          {/* Revenue Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Booked Revenue (ACV)</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(outputs.bookedRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {outputs.totalConversions} clients × {formatCurrency(inputs.avgMonthlyFee * 12)} each
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">2026 Cash Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(outputs.annualRevenue)}
              </p>
              <p className={`text-xs mt-1 ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
                {isAboveTarget ? '+' : ''}{formatCurrency(targetVariance)} vs {formatCurrency(eoyRevenueTarget)} target
              </p>
            </div>
          </div>

          {/* Quarterly Breakdown */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Quarterly Revenue</p>
            <div className="grid grid-cols-4 gap-2">
              {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter) => {
                const revenue = outputs.quarterlyRevenue[quarter];
                const maxRevenue = Math.max(...Object.values(outputs.quarterlyRevenue));
                const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={quarter} className="text-center">
                    <div className="h-24 flex items-end justify-center mb-2">
                      <div
                        className="w-full bg-indigo-500 rounded-t transition-all duration-300"
                        style={{ height: `${heightPercent}%`, minHeight: revenue > 0 ? '4px' : '0' }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase">{quarter}</p>
                    <p className="text-xs text-gray-900">{formatCurrency(revenue)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{outputs.totalSpecs}</p>
              <p className="text-xs text-gray-500">Total Specs</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{outputs.totalConversions}</p>
              <p className="text-xs text-gray-500">Conversions</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(outputs.avgACV)}</p>
              <p className="text-xs text-gray-500">Avg ACV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Scenarios */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Saved Scenarios</h3>
          {scenariosLoading && (
            <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          )}
        </div>

        {scenariosError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
            {scenariosError}
            <button onClick={refetch} className="ml-2 underline">Retry</button>
          </div>
        )}

        {!scenariosLoading && scenarios.length === 0 ? (
          <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            <p className="text-sm">No saved scenarios yet</p>
            <p className="text-xs mt-1">Save your first scenario using the button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onLoad={handleLoadScenario}
                onDelete={handleDeleteScenario}
                isSelected={selectedScenarioId === scenario.id}
                revenueTarget={eoyRevenueTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      <SaveScenarioModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveScenario}
        inputs={inputs}
        saving={creating}
      />
    </div>
  );
}
