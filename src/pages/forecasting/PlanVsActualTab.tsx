import { TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/forecastCalculations';
import { useSalesConfig } from '@/hooks/useSalesConfig';

interface QuarterCardProps {
  quarter: string;
  target: number;
  actual: number | null;
  specsTarget: number;
  specsActual: number | null;
  conversionsTarget: number;
  conversionsActual: number | null;
}

function QuarterCard({ quarter, target, actual, specsTarget, specsActual, conversionsTarget, conversionsActual }: QuarterCardProps) {
  const hasData = actual !== null;
  const variance = hasData ? actual - target : null;
  const isPositive = variance !== null && variance >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{quarter}</h4>
        {hasData && (
          <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{formatCurrency(variance!)}
          </span>
        )}
        {!hasData && (
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Minus className="w-4 h-4" />
            Pending
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Revenue */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Revenue</span>
            <span className="font-medium text-gray-900">
              {hasData ? formatCurrency(actual) : '—'} / {formatCurrency(target)}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${hasData ? (isPositive ? 'bg-green-500' : 'bg-amber-500') : 'bg-gray-200'}`}
              style={{ width: hasData ? `${Math.min((actual / target) * 100, 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* Specs */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Specs</span>
          <span className="font-medium text-gray-700">
            {specsActual ?? '—'} / {specsTarget}
          </span>
        </div>

        {/* Conversions */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Conversions</span>
          <span className="font-medium text-gray-700">
            {conversionsActual ?? '—'} / {conversionsTarget}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PlanVsActualTab() {
  const {
    actuals,
    targets,
    whygoGoal,
    ownerName,
    eoyRevenueTarget,
    totalSpecsTarget,
    totalConversionsTarget,
    loading,
    error,
    refetch
  } = useSalesConfig(2026);

  // Calculate YTD totals from actuals
  const ytdActualRevenue = [actuals.q1.revenue, actuals.q2.revenue, actuals.q3.revenue, actuals.q4.revenue]
    .filter((r): r is number => r !== null)
    .reduce((sum, r) => sum + r, 0);

  const ytdActualSpecs = [actuals.q1.specs, actuals.q2.specs, actuals.q3.specs, actuals.q4.specs]
    .filter((s): s is number => s !== null)
    .reduce((sum, s) => sum + s, 0);

  const ytdActualConversions = [actuals.q1.conversions, actuals.q2.conversions, actuals.q3.conversions, actuals.q4.conversions]
    .filter((c): c is number => c !== null)
    .reduce((sum, c) => sum + c, 0);

  const ytdTarget = eoyRevenueTarget;
  const ytdPercent = ytdTarget > 0 ? (ytdActualRevenue / ytdTarget) * 100 : 0;

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
      {/* WhyGO Targets Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          2026 Revenue Targets
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          {whygoGoal || 'Sales WhyGO #1: 18+ specs, 75% conversion, $7M revenue'}
        </p>
        {ownerName && (
          <p className="text-xs text-gray-500 mb-4">Owner: {ownerName}</p>
        )}

        {/* YTD Progress */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Year-to-Date Progress</span>
            <span className="text-sm text-gray-600">
              {formatCurrency(ytdActualRevenue)} / {formatCurrency(ytdTarget)}
            </span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min(ytdPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {ytdPercent.toFixed(1)}% of annual target
          </p>
        </div>
      </div>

      {/* Quarterly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuarterCard
          quarter="Q1"
          target={targets.q1.revenue}
          actual={actuals.q1.revenue}
          specsTarget={targets.q1.specs}
          specsActual={actuals.q1.specs}
          conversionsTarget={targets.q1.conversions}
          conversionsActual={actuals.q1.conversions}
        />
        <QuarterCard
          quarter="Q2"
          target={targets.q2.revenue}
          actual={actuals.q2.revenue}
          specsTarget={targets.q2.specs}
          specsActual={actuals.q2.specs}
          conversionsTarget={targets.q2.conversions}
          conversionsActual={actuals.q2.conversions}
        />
        <QuarterCard
          quarter="Q3"
          target={targets.q3.revenue}
          actual={actuals.q3.revenue}
          specsTarget={targets.q3.specs}
          specsActual={actuals.q3.specs}
          conversionsTarget={targets.q3.conversions}
          conversionsActual={actuals.q3.conversions}
        />
        <QuarterCard
          quarter="Q4"
          target={targets.q4.revenue}
          actual={actuals.q4.revenue}
          specsTarget={targets.q4.specs}
          specsActual={actuals.q4.specs}
          conversionsTarget={targets.q4.conversions}
          conversionsActual={actuals.q4.conversions}
        />
      </div>

      {/* Key Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {ytdActualSpecs} / {totalSpecsTarget}
            </p>
            <p className="text-sm text-gray-500 mt-1">Specs Started</p>
            <p className="text-xs text-gray-400">Target: {totalSpecsTarget} by EOY</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {ytdActualConversions} / {totalConversionsTarget}
            </p>
            <p className="text-sm text-gray-500 mt-1">Conversions</p>
            <p className="text-xs text-gray-400">Target: 75% rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(ytdActualConversions > 0 ? ytdActualRevenue / ytdActualConversions : 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Deal Size</p>
            <p className="text-xs text-gray-400">Target: $75K/month</p>
          </div>
        </div>
      </div>

      {/* Data Source Note */}
      <p className="text-xs text-gray-400 text-center">
        Data pulled from Sales department WhyGO outcomes. Update actuals in the Sales WhyGO detail view.
      </p>
    </div>
  );
}
