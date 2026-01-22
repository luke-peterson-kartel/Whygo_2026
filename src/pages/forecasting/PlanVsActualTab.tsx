import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/forecastCalculations';
import { WHYGO_QUARTERLY_TARGETS } from '@/types/forecasting.types';

// Placeholder actuals - will be replaced with Firebase data in Phase 3
const PLACEHOLDER_ACTUALS = {
  q1: { specs: 3, conversions: 2, revenue: 450000 },
  q2: { specs: null, conversions: null, revenue: null },
  q3: { specs: null, conversions: null, revenue: null },
  q4: { specs: null, conversions: null, revenue: null },
};

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
  // Calculate YTD totals
  const ytdActual = Object.values(PLACEHOLDER_ACTUALS)
    .filter(q => q.revenue !== null)
    .reduce((sum, q) => sum + (q.revenue || 0), 0);
  const ytdTarget = WHYGO_QUARTERLY_TARGETS.q4;
  const ytdPercent = (ytdActual / ytdTarget) * 100;

  return (
    <div className="space-y-6">
      {/* WhyGO Targets Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          2026 Revenue Targets
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          From Sales WhyGO #1: 18+ specs, 75% conversion, $7M revenue
        </p>

        {/* YTD Progress */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Year-to-Date Progress</span>
            <span className="text-sm text-gray-600">
              {formatCurrency(ytdActual)} / {formatCurrency(ytdTarget)}
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
          target={WHYGO_QUARTERLY_TARGETS.q1}
          actual={PLACEHOLDER_ACTUALS.q1.revenue}
          specsTarget={5}
          specsActual={PLACEHOLDER_ACTUALS.q1.specs}
          conversionsTarget={4}
          conversionsActual={PLACEHOLDER_ACTUALS.q1.conversions}
        />
        <QuarterCard
          quarter="Q2"
          target={WHYGO_QUARTERLY_TARGETS.q2 - WHYGO_QUARTERLY_TARGETS.q1}
          actual={PLACEHOLDER_ACTUALS.q2.revenue}
          specsTarget={5}
          specsActual={PLACEHOLDER_ACTUALS.q2.specs}
          conversionsTarget={4}
          conversionsActual={PLACEHOLDER_ACTUALS.q2.conversions}
        />
        <QuarterCard
          quarter="Q3"
          target={WHYGO_QUARTERLY_TARGETS.q3 - WHYGO_QUARTERLY_TARGETS.q2}
          actual={PLACEHOLDER_ACTUALS.q3.revenue}
          specsTarget={4}
          specsActual={PLACEHOLDER_ACTUALS.q3.specs}
          conversionsTarget={3}
          conversionsActual={PLACEHOLDER_ACTUALS.q3.conversions}
        />
        <QuarterCard
          quarter="Q4"
          target={WHYGO_QUARTERLY_TARGETS.q4 - WHYGO_QUARTERLY_TARGETS.q3}
          actual={PLACEHOLDER_ACTUALS.q4.revenue}
          specsTarget={4}
          specsActual={PLACEHOLDER_ACTUALS.q4.specs}
          conversionsTarget={3}
          conversionsActual={PLACEHOLDER_ACTUALS.q4.conversions}
        />
      </div>

      {/* Key Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {PLACEHOLDER_ACTUALS.q1.specs ?? 0} / 18
            </p>
            <p className="text-sm text-gray-500 mt-1">Specs Started</p>
            <p className="text-xs text-gray-400">Target: 18 by EOY</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {PLACEHOLDER_ACTUALS.q1.conversions ?? 0} / 14
            </p>
            <p className="text-sm text-gray-500 mt-1">Conversions</p>
            <p className="text-xs text-gray-400">Target: 75% rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(ytdActual > 0 ? ytdActual / (PLACEHOLDER_ACTUALS.q1.conversions || 1) : 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Avg Deal Size</p>
            <p className="text-xs text-gray-400">Target: $75K/month</p>
          </div>
        </div>
      </div>

      {/* Data Source Note */}
      <p className="text-xs text-gray-400 text-center">
        Actuals will be linked to Sales WhyGO outcomes in Phase 3
      </p>
    </div>
  );
}
