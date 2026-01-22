import type { ScenarioInputs, ScenarioOutputs, QuarterlyData, PipelineDeal } from '@/types/forecasting.types';

/**
 * Revenue Calculation Model
 *
 * Deal Payment Structure:
 * - Month 1-2: Spec period (no payment)
 * - Month 3: 3x monthly payment (retroactive for months 1-2 + current)
 * - Months 4-12: Regular monthly payments
 *
 * Revenue timing by quarter of spec signing:
 * - Q1 spec (Jan) -> converts Mar -> pays 3x Mar + 9 months (Apr-Dec)
 * - Q2 spec (Apr) -> converts Jun -> pays 3x Jun + 6 months (Jul-Dec)
 * - Q3 spec (Jul) -> converts Sep -> pays 3x Sep + 3 months (Oct-Dec)
 * - Q4 spec (Oct) -> converts Dec -> pays 3x Dec + 0 months remaining
 */

// Months of regular payments remaining in year after Month 3 payment, by quarter
const REMAINING_MONTHS_BY_QUARTER: QuarterlyData = {
  q1: 9,  // Apr-Dec
  q2: 6,  // Jul-Dec
  q3: 3,  // Oct-Dec
  q4: 0,  // No remaining months in year
};

/**
 * Calculate forecast outputs from scenario inputs
 */
export function calculateForecast(inputs: ScenarioInputs): ScenarioOutputs {
  const { specsPerQuarter, conversionRate, avgMonthlyFee } = inputs;

  // Calculate conversions per quarter (specs * conversion rate)
  const conversionsPerQuarter: QuarterlyData = {
    q1: Math.round(specsPerQuarter.q1 * conversionRate),
    q2: Math.round(specsPerQuarter.q2 * conversionRate),
    q3: Math.round(specsPerQuarter.q3 * conversionRate),
    q4: Math.round(specsPerQuarter.q4 * conversionRate),
  };

  // Calculate revenue per quarter
  // Each converted client generates: 3x payment in conversion quarter + ongoing MRR
  const quarterlyRevenue = calculateQuarterlyRevenue(conversionsPerQuarter, avgMonthlyFee);

  // Calculate cumulative revenue
  const cumulativeRevenue: QuarterlyData = {
    q1: quarterlyRevenue.q1,
    q2: quarterlyRevenue.q1 + quarterlyRevenue.q2,
    q3: quarterlyRevenue.q1 + quarterlyRevenue.q2 + quarterlyRevenue.q3,
    q4: quarterlyRevenue.q1 + quarterlyRevenue.q2 + quarterlyRevenue.q3 + quarterlyRevenue.q4,
  };

  const totalSpecs = specsPerQuarter.q1 + specsPerQuarter.q2 + specsPerQuarter.q3 + specsPerQuarter.q4;
  const totalConversions = conversionsPerQuarter.q1 + conversionsPerQuarter.q2 + conversionsPerQuarter.q3 + conversionsPerQuarter.q4;
  const annualRevenue = cumulativeRevenue.q4;
  const avgACV = totalConversions > 0 ? Math.round(annualRevenue / totalConversions) : 0;

  return {
    quarterlyRevenue,
    cumulativeRevenue,
    annualRevenue,
    totalSpecs,
    totalConversions,
    avgACV,
  };
}

/**
 * Calculate revenue by quarter considering payment timing
 */
function calculateQuarterlyRevenue(
  conversions: QuarterlyData,
  monthlyFee: number
): QuarterlyData {
  const month3Payment = 3 * monthlyFee;

  // Q1 Revenue: Q1 conversions pay 3x in Q1
  const q1Revenue = conversions.q1 * month3Payment;

  // Q2 Revenue:
  // - Q1 conversions: 3 months of regular MRR (Apr, May, Jun)
  // - Q2 conversions: 3x payment in Q2
  const q2Revenue =
    (conversions.q1 * 3 * monthlyFee) +
    (conversions.q2 * month3Payment);

  // Q3 Revenue:
  // - Q1 conversions: 3 months of regular MRR (Jul, Aug, Sep)
  // - Q2 conversions: 3 months of regular MRR (Jul, Aug, Sep)
  // - Q3 conversions: 3x payment in Q3
  const q3Revenue =
    (conversions.q1 * 3 * monthlyFee) +
    (conversions.q2 * 3 * monthlyFee) +
    (conversions.q3 * month3Payment);

  // Q4 Revenue:
  // - Q1 conversions: 3 months of regular MRR (Oct, Nov, Dec)
  // - Q2 conversions: 3 months of regular MRR (Oct, Nov, Dec)
  // - Q3 conversions: 3 months of regular MRR (Oct, Nov, Dec)
  // - Q4 conversions: 3x payment in Q4
  const q4Revenue =
    (conversions.q1 * 3 * monthlyFee) +
    (conversions.q2 * 3 * monthlyFee) +
    (conversions.q3 * 3 * monthlyFee) +
    (conversions.q4 * month3Payment);

  return {
    q1: q1Revenue,
    q2: q2Revenue,
    q3: q3Revenue,
    q4: q4Revenue,
  };
}

/**
 * Calculate total revenue for a single client based on when they signed
 */
export function calculateClientAnnualRevenue(
  monthlyFee: number,
  signQuarter: keyof QuarterlyData
): number {
  const month3Payment = 3 * monthlyFee;
  const remainingMonths = REMAINING_MONTHS_BY_QUARTER[signQuarter];
  return month3Payment + (remainingMonths * monthlyFee);
}

/**
 * Calculate weighted pipeline value
 */
export function calculateWeightedPipeline(deals: PipelineDeal[]): number {
  return deals.reduce((total, deal) => {
    if (deal.stage === 'lost') return total;
    const annualValue = deal.monthlyFee * 12;
    return total + (annualValue * (deal.probability / 100));
  }, 0);
}

/**
 * Calculate total pipeline value (unweighted)
 */
export function calculateTotalPipeline(deals: PipelineDeal[]): number {
  return deals.reduce((total, deal) => {
    if (deal.stage === 'lost' || deal.stage === 'converted') return total;
    return total + (deal.monthlyFee * 12);
  }, 0);
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Calculate variance between actual and target
 */
export function calculateVariance(actual: number, target: number): {
  amount: number;
  percentage: number;
  isPositive: boolean;
} {
  const amount = actual - target;
  const percentage = target > 0 ? (amount / target) : 0;
  return {
    amount,
    percentage,
    isPositive: amount >= 0,
  };
}
