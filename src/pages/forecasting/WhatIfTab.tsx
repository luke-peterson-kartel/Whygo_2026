import { useState, useMemo } from 'react';
import { Calculator, Save } from 'lucide-react';
import { calculateForecast, formatCurrency, formatPercent } from '@/lib/utils/forecastCalculations';
import { DEFAULT_SCENARIO_INPUTS, WHYGO_QUARTERLY_TARGETS } from '@/types/forecasting.types';
import type { ScenarioInputs } from '@/types/forecasting.types';

export function WhatIfTab() {
  const [inputs, setInputs] = useState<ScenarioInputs>(DEFAULT_SCENARIO_INPUTS);

  // Calculate outputs whenever inputs change
  const outputs = useMemo(() => calculateForecast(inputs), [inputs]);

  // Calculate variance from WhyGO target
  const targetVariance = outputs.annualRevenue - WHYGO_QUARTERLY_TARGETS.q4;
  const isAboveTarget = targetVariance >= 0;

  const updateSpecsForQuarter = (quarter: keyof typeof inputs.specsPerQuarter, value: number) => {
    setInputs(prev => ({
      ...prev,
      specsPerQuarter: {
        ...prev.specsPerQuarter,
        [quarter]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Scenario Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs Panel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Scenario Inputs</h3>
          </div>

          {/* Specs per Quarter */}
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Specs per Quarter
            </label>
            {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter) => (
              <div key={quarter} className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-gray-600 uppercase">
                  {quarter}
                </span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={inputs.specsPerQuarter[quarter]}
                  onChange={(e) => updateSpecsForQuarter(quarter, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="w-8 text-sm font-semibold text-gray-900 text-right">
                  {inputs.specsPerQuarter[quarter]}
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-1">
              Total: {inputs.specsPerQuarter.q1 + inputs.specsPerQuarter.q2 + inputs.specsPerQuarter.q3 + inputs.specsPerQuarter.q4} specs
              (WhyGO target: 18)
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
                onChange={(e) => setInputs(prev => ({ ...prev, conversionRate: parseInt(e.target.value) / 100 }))}
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
                onChange={(e) => setInputs(prev => ({ ...prev, avgMonthlyFee: parseInt(e.target.value) || 0 }))}
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
              onClick={() => {/* TODO: Save scenario */}}
            >
              <Save className="w-4 h-4" />
              Save Scenario
            </button>
          </div>

          {/* Annual Revenue */}
          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Annual Revenue</p>
            <p className="text-4xl font-bold text-gray-900">
              {formatCurrency(outputs.annualRevenue)}
            </p>
            <p className={`text-sm mt-1 ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
              {isAboveTarget ? '+' : ''}{formatCurrency(targetVariance)} vs $7M target
            </p>
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

      {/* Saved Scenarios - Placeholder for Phase 2 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            <p className="text-sm">No saved scenarios yet</p>
            <p className="text-xs mt-1">Save your first scenario above</p>
          </div>
        </div>
      </div>
    </div>
  );
}
