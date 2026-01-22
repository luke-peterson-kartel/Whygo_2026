import { useState, useMemo } from 'react';
import { FileSpreadsheet, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils/forecastCalculations';
import { DEFAULT_SCENARIO_INPUTS } from '@/types/forecasting.types';
import type { MonthlySpecs, ScenarioInputs } from '@/types/forecasting.types';
import { useSalesConfig } from '@/hooks/useSalesConfig';

const MONTH_KEYS: Array<keyof MonthlySpecs> = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ProformaData {
  // Assumptions
  monthlyFee: number;
  specPeriodMonths: number;
  targetConversionRate: number;
  targetSpecs: number;
  targetRevenue: number;

  // Monthly breakdown
  monthly: {
    newSpecs: number[];
    cumulativeSpecs: number[];
    conversionsThisMonth: number[];
    cumulativeClients: number[];
    month3Payments: number[];
    ongoingMRR: number[];
    totalMonthlyRevenue: number[];
    cumulativeRevenue: number[];
  };

  // Quarterly
  quarterly: {
    specsProjected: number[];
    specsTarget: number[];
    clientsProjected: number[];
    clientsTarget: number[];
    revenueProjected: number[];
    revenueTarget: number[];
    variance: number[];
  };

  // Summary
  summary: {
    totalSpecs: number;
    totalConversions: number;
    conversionRate: number;
    totalRevenue: number;
    gapToTarget: number;
  };
}

interface QuarterlyTargets {
  specsTarget: number[];
  clientsTarget: number[];
  revenueTarget: number[];
  totalSpecsTarget: number;
  totalRevenueTarget: number;
}

function calculateProforma(
  specsPerMonth: MonthlySpecs,
  conversionRate: number,
  avgMonthlyFee: number,
  quarterlyTargets: QuarterlyTargets
): ProformaData {
  const specPeriodMonths = 2;

  // Get specs as array
  const newSpecs = MONTH_KEYS.map(key => specsPerMonth[key]);

  // Calculate cumulative specs
  const cumulativeSpecs: number[] = [];
  let runningSpecs = 0;
  for (let i = 0; i < 12; i++) {
    runningSpecs += newSpecs[i];
    cumulativeSpecs.push(runningSpecs);
  }

  // Calculate conversions (specs from 2 months ago convert this month)
  // Apply conversion rate to total, then distribute proportionally
  const totalSpecs = cumulativeSpecs[11];
  const totalConversions = Math.round(totalSpecs * conversionRate);

  // Calculate raw conversions per month (before rate applied)
  const rawConversions: number[] = [];
  for (let i = 0; i < 12; i++) {
    // Specs signed in month (i - specPeriodMonths) convert in month i
    const specMonth = i - specPeriodMonths;
    if (specMonth >= 0) {
      rawConversions.push(newSpecs[specMonth]);
    } else {
      rawConversions.push(0);
    }
  }

  // Apply conversion rate proportionally
  const totalRawConversions = rawConversions.reduce((a, b) => a + b, 0);
  const conversionsThisMonth: number[] = [];
  let conversionsAssigned = 0;

  for (let i = 0; i < 12; i++) {
    if (totalRawConversions > 0 && i < 11) {
      const monthConversions = Math.round((rawConversions[i] / totalRawConversions) * totalConversions);
      conversionsThisMonth.push(monthConversions);
      conversionsAssigned += monthConversions;
    } else if (i === 11 && totalRawConversions > 0) {
      // Last month gets remainder to avoid rounding errors
      conversionsThisMonth.push(totalConversions - conversionsAssigned);
    } else {
      conversionsThisMonth.push(0);
    }
  }

  // Calculate cumulative paying clients
  const cumulativeClients: number[] = [];
  let runningClients = 0;
  for (let i = 0; i < 12; i++) {
    runningClients += conversionsThisMonth[i];
    cumulativeClients.push(runningClients);
  }

  // Calculate Month 3 payments (3x fee for new conversions)
  const month3Payments = conversionsThisMonth.map(c => c * 3 * avgMonthlyFee);

  // Calculate ongoing MRR (clients from previous months paying regular fee)
  const ongoingMRR: number[] = [];
  for (let i = 0; i < 12; i++) {
    // Clients who converted before this month pay regular MRR
    const clientsPayingMRR = i > 0 ? cumulativeClients[i - 1] : 0;
    ongoingMRR.push(clientsPayingMRR * avgMonthlyFee);
  }

  // Total monthly revenue
  const totalMonthlyRevenue = month3Payments.map((m3, i) => m3 + ongoingMRR[i]);

  // Cumulative revenue
  const cumulativeRevenue: number[] = [];
  let runningRevenue = 0;
  for (let i = 0; i < 12; i++) {
    runningRevenue += totalMonthlyRevenue[i];
    cumulativeRevenue.push(runningRevenue);
  }

  // Quarterly aggregation
  const quarterEndMonths = [2, 5, 8, 11]; // Mar, Jun, Sep, Dec (0-indexed)
  const specsProjected = quarterEndMonths.map(m => cumulativeSpecs[m]);
  const clientsProjected = quarterEndMonths.map(m => cumulativeClients[m]);
  const revenueProjected = quarterEndMonths.map(m => cumulativeRevenue[m]);

  // WhyGO targets from Sales department outcomes
  const { specsTarget, clientsTarget, revenueTarget, totalSpecsTarget, totalRevenueTarget } = quarterlyTargets;

  const variance = revenueProjected.map((r, i) => r - revenueTarget[i]);

  return {
    monthlyFee: avgMonthlyFee,
    specPeriodMonths,
    targetConversionRate: 0.75,
    targetSpecs: totalSpecsTarget,
    targetRevenue: totalRevenueTarget,
    monthly: {
      newSpecs,
      cumulativeSpecs,
      conversionsThisMonth,
      cumulativeClients,
      month3Payments,
      ongoingMRR,
      totalMonthlyRevenue,
      cumulativeRevenue,
    },
    quarterly: {
      specsProjected,
      specsTarget,
      clientsProjected,
      clientsTarget,
      revenueProjected,
      revenueTarget,
      variance,
    },
    summary: {
      totalSpecs,
      totalConversions: cumulativeClients[11],
      conversionRate: totalSpecs > 0 ? cumulativeClients[11] / totalSpecs : 0,
      totalRevenue: cumulativeRevenue[11],
      gapToTarget: cumulativeRevenue[11] - totalRevenueTarget,
    },
  };
}

export function ProformaTab() {
  const [inputs, setInputs] = useState<ScenarioInputs>(DEFAULT_SCENARIO_INPUTS);
  const {
    cumulativeTargets,
    eoyRevenueTarget,
    totalSpecsTarget,
    whygoGoal,
    ownerName,
    loading,
    error,
    refetch
  } = useSalesConfig(2026);

  // Build quarterly targets from centralized config (single source of truth)
  const quarterlyTargets = useMemo((): QuarterlyTargets => {
    return {
      specsTarget: [
        cumulativeTargets.q1.specs,
        cumulativeTargets.q2.specs,
        cumulativeTargets.q3.specs,
        cumulativeTargets.q4.specs,
      ],
      clientsTarget: [
        cumulativeTargets.q1.conversions,
        cumulativeTargets.q2.conversions,
        cumulativeTargets.q3.conversions,
        cumulativeTargets.q4.conversions,
      ],
      revenueTarget: [
        cumulativeTargets.q1.revenue,
        cumulativeTargets.q2.revenue,
        cumulativeTargets.q3.revenue,
        cumulativeTargets.q4.revenue,
      ],
      totalSpecsTarget,
      totalRevenueTarget: eoyRevenueTarget,
    };
  }, [cumulativeTargets, totalSpecsTarget, eoyRevenueTarget]);

  const proforma = useMemo(
    () => calculateProforma(inputs.specsPerMonth, inputs.conversionRate, inputs.avgMonthlyFee, quarterlyTargets),
    [inputs, quarterlyTargets]
  );

  const { monthly, quarterly, summary } = proforma;

  const totalSpecs = MONTH_KEYS.reduce((sum, month) => sum + inputs.specsPerMonth[month], 0);

  const updateSpecsForMonth = (month: keyof MonthlySpecs, value: number) => {
    setInputs(prev => ({
      ...prev,
      specsPerMonth: {
        ...prev.specsPerMonth,
        [month]: value,
      },
    }));
  };

  const handleResetToDefault = () => {
    setInputs(DEFAULT_SCENARIO_INPUTS);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">2026 Revenue Projection - WhyGO Aligned</h2>
            <p className="text-sm text-gray-500">
              {whygoGoal || 'Sales WhyGO #1: 18+ specs, 75% conversion, $7M revenue'}
              {ownerName && <span className="text-gray-400 ml-2">• Owner: {ownerName}</span>}
            </p>
          </div>
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

      {/* Configurable Inputs */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">SCENARIO INPUTS</h3>

        {/* Monthly Specs */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specs Closing by Month
          </label>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {MONTH_KEYS.map((month, i) => (
              <div key={month} className="text-center">
                <label className="block text-xs text-gray-500 mb-1">
                  {MONTH_LABELS[i]}
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
          <p className="text-xs text-gray-500 mt-2">
            Total: {totalSpecs} specs (WhyGO target: 18). Specs convert 2 months after closing.
          </p>
        </div>

        {/* Conversion Rate & Monthly Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <p className="text-xs text-gray-500 mt-1">WhyGO target: 75%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <p className="text-xs text-gray-500 mt-1">Target: $75,000/month</p>
          </div>
        </div>
      </div>

      {/* WhyGO Assumptions (now showing actual inputs) */}
      <div className="bg-indigo-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-900 mb-3">CURRENT ASSUMPTIONS</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="text-indigo-600">Monthly Fee (avg)</p>
            <p className="font-semibold text-indigo-900">{formatCurrency(inputs.avgMonthlyFee)}</p>
          </div>
          <div>
            <p className="text-indigo-600">Spec Period</p>
            <p className="font-semibold text-indigo-900">{proforma.specPeriodMonths} months</p>
          </div>
          <div>
            <p className="text-indigo-600">Conversion Rate</p>
            <p className="font-semibold text-indigo-900">{formatPercent(inputs.conversionRate)}</p>
          </div>
          <div>
            <p className="text-indigo-600">Total Specs</p>
            <p className="font-semibold text-indigo-900">{totalSpecs}</p>
          </div>
          <div>
            <p className="text-indigo-600">Target Revenue</p>
            <p className="font-semibold text-indigo-900">{formatCurrency(proforma.targetRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">MONTHLY BREAKDOWN</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 font-medium text-gray-700 sticky left-0 bg-gray-50 min-w-[180px]"></th>
                {MONTH_LABELS.map(month => (
                  <th key={month} className="text-right px-3 py-2 font-medium text-gray-700 min-w-[80px]">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-white">New Specs Signed</td>
                {monthly.newSpecs.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-700">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-white">Cumulative Specs</td>
                {monthly.cumulativeSpecs.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-700">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 bg-blue-50/50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-blue-50/50">Conversions This Month</td>
                {monthly.conversionsThisMonth.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-700">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 bg-blue-50/50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-blue-50/50">Cumulative Paying Clients</td>
                {monthly.cumulativeClients.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-700">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 bg-green-50/50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-green-50/50">Month 3 Payments (3x fee)</td>
                {monthly.month3Payments.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-700">{formatCurrency(v)}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 bg-green-50/50">
                <td className="px-3 py-2 font-medium text-gray-900 sticky left-0 bg-green-50/50">Ongoing MRR (months 4+)</td>
                {monthly.ongoingMRR.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-700">{formatCurrency(v)}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 bg-green-100/50 font-semibold">
                <td className="px-3 py-2 text-gray-900 sticky left-0 bg-green-100/50">Total Monthly Revenue</td>
                {monthly.totalMonthlyRevenue.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-gray-900">{formatCurrency(v)}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 bg-indigo-100/50 font-semibold">
                <td className="px-3 py-2 text-indigo-900 sticky left-0 bg-indigo-100/50">Cumulative Revenue</td>
                {monthly.cumulativeRevenue.map((v, i) => (
                  <td key={i} className="text-right px-3 py-2 text-indigo-900">{formatCurrency(v)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quarterly Check vs WhyGO */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">QUARTERLY CHECK VS WHYGO</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 font-medium text-gray-700 min-w-[180px]"></th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">Q1</th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">Q2</th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">Q3</th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">Q4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">Specs (Projected)</td>
                {quarterly.specsProjected.map((v, i) => (
                  <td key={i} className="text-right px-4 py-2 text-gray-700">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 text-gray-500">
                <td className="px-4 py-2 font-medium">Specs (WhyGO Target)</td>
                {quarterly.specsTarget.map((v, i) => (
                  <td key={i} className="text-right px-4 py-2">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">Paying Clients (Projected)</td>
                {quarterly.clientsProjected.map((v, i) => (
                  <td key={i} className="text-right px-4 py-2 text-gray-700">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 text-gray-500">
                <td className="px-4 py-2 font-medium">Paying Clients (WhyGO Target)</td>
                {quarterly.clientsTarget.map((v, i) => (
                  <td key={i} className="text-right px-4 py-2">{v}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 font-semibold">
                <td className="px-4 py-2 text-gray-900">Revenue (Projected)</td>
                {quarterly.revenueProjected.map((v, i) => (
                  <td key={i} className="text-right px-4 py-2 text-gray-900">{formatCurrency(v)}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50 text-gray-500">
                <td className="px-4 py-2 font-medium">Revenue (WhyGO Target)</td>
                {quarterly.revenueTarget.map((v, i) => (
                  <td key={i} className="text-right px-4 py-2">{formatCurrency(v)}</td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold text-gray-900">Variance</td>
                {quarterly.variance.map((v, i) => (
                  <td key={i} className={`text-right px-4 py-2 font-semibold ${v >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {v >= 0 ? '+' : ''}{formatCurrency(v)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Specs Signed</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalSpecs}</p>
          <p className="text-xs text-gray-400">Target: {quarterlyTargets.totalSpecsTarget}+</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Conversions</p>
          <p className="text-2xl font-bold text-gray-900">{summary.totalConversions}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900">{Math.round(summary.conversionRate * 100)}%</p>
          <p className="text-xs text-gray-400">Target: 75%+</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total 2026 Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-xs text-gray-400">Target: {formatCurrency(quarterlyTargets.totalRevenueTarget)}</p>
        </div>
        <div className={`border rounded-lg p-4 ${summary.gapToTarget >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-sm text-gray-500 mb-1">Gap to WhyGO</p>
          <div className="flex items-center gap-2">
            {summary.gapToTarget >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-2xl font-bold ${summary.gapToTarget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.gapToTarget >= 0 ? '+' : ''}{formatCurrency(summary.gapToTarget)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
