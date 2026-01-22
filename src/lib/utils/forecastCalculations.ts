import type { ScenarioInputs, ScenarioOutputs, QuarterlyData, PipelineDeal, MonthlySpecs } from '@/types/forecasting.types';

/**
 * Revenue Calculation Model - Month-Level Granularity
 *
 * Deal Payment Structure:
 * - Month 1-2 of deal: Spec period (no payment)
 * - Month 3 of deal: 3x monthly payment (retroactive for months 1-2 + current)
 * - Months 4+ of deal: Regular monthly payments until end of year
 *
 * Key insight: A spec signed in February doesn't pay until April (Month 3 of deal).
 * Q1 revenue only comes from specs signed in January that convert in March.
 */

// Get the conversion month (spec month + 2 for spec period)
function getConversionMonth(specMonth: number): number {
  return specMonth + 2; // Month 3 of the deal
}

// Month key to number mapping
const MONTH_TO_NUMBER: Record<keyof MonthlySpecs, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Convert MonthlySpecs to array of {specMonth, count}
 */
function getSpecsByMonth(specsPerMonth: MonthlySpecs): Array<{ specMonth: number; count: number }> {
  const result: Array<{ specMonth: number; count: number }> = [];

  for (const [key, count] of Object.entries(specsPerMonth)) {
    if (count > 0) {
      result.push({ specMonth: MONTH_TO_NUMBER[key as keyof MonthlySpecs], count });
    }
  }

  return result;
}

/**
 * Calculate revenue for a single converted client
 * Returns monthly revenue breakdown from conversion month through December
 */
function calculateClientRevenue(
  specMonth: number,
  monthlyFee: number
): { [month: number]: number } {
  const revenue: { [month: number]: number } = {};
  const conversionMonth = getConversionMonth(specMonth);

  // If conversion is after December, no revenue this year
  if (conversionMonth > 12) {
    return revenue;
  }

  // Month 3 payment (3x retroactive)
  revenue[conversionMonth] = 3 * monthlyFee;

  // Regular monthly payments for remaining months
  for (let m = conversionMonth + 1; m <= 12; m++) {
    revenue[m] = monthlyFee;
  }

  return revenue;
}

/**
 * Calculate forecast outputs from scenario inputs
 */
export function calculateForecast(inputs: ScenarioInputs): ScenarioOutputs {
  const { specsPerMonth, conversionRate, avgMonthlyFee } = inputs;

  // Get specs by month directly from input
  const specsByMonth = getSpecsByMonth(specsPerMonth);

  // Initialize monthly revenue
  const monthlyRevenue: { [month: number]: number } = {};
  for (let m = 1; m <= 12; m++) {
    monthlyRevenue[m] = 0;
  }

  // Calculate total specs first
  let totalSpecs = 0;
  let specsConvertingThisYear = 0;

  for (const { specMonth, count } of specsByMonth) {
    totalSpecs += count;
    const conversionMonth = getConversionMonth(specMonth);
    if (conversionMonth <= 12) {
      specsConvertingThisYear += count;
    }
  }

  // Apply conversion rate to totals (not per-month to avoid rounding errors)
  const totalConversions = Math.round(totalSpecs * conversionRate);
  const conversionsThisYear = Math.round(specsConvertingThisYear * conversionRate);

  // Distribute conversions proportionally across months for revenue timing
  // Each month's share of conversions = (month's specs / total specs) * total conversions
  for (const { specMonth, count } of specsByMonth) {
    const conversionMonth = getConversionMonth(specMonth);

    // Only add to 2026 cash revenue if conversion happens this year
    if (conversionMonth <= 12 && specsConvertingThisYear > 0) {
      // Proportional conversions for this month's cohort
      const monthConversions = Math.round((count / specsConvertingThisYear) * conversionsThisYear);

      // Add revenue for each converted client (only for 2026)
      const clientRevenue = calculateClientRevenue(specMonth, avgMonthlyFee);
      for (const [month, amount] of Object.entries(clientRevenue)) {
        monthlyRevenue[parseInt(month)] += amount * monthConversions;
      }
    }
  }

  // Aggregate to quarterly
  const quarterlyRevenue: QuarterlyData = {
    q1: monthlyRevenue[1] + monthlyRevenue[2] + monthlyRevenue[3],
    q2: monthlyRevenue[4] + monthlyRevenue[5] + monthlyRevenue[6],
    q3: monthlyRevenue[7] + monthlyRevenue[8] + monthlyRevenue[9],
    q4: monthlyRevenue[10] + monthlyRevenue[11] + monthlyRevenue[12],
  };

  // Calculate cumulative revenue
  const cumulativeRevenue: QuarterlyData = {
    q1: quarterlyRevenue.q1,
    q2: quarterlyRevenue.q1 + quarterlyRevenue.q2,
    q3: quarterlyRevenue.q1 + quarterlyRevenue.q2 + quarterlyRevenue.q3,
    q4: quarterlyRevenue.q1 + quarterlyRevenue.q2 + quarterlyRevenue.q3 + quarterlyRevenue.q4,
  };

  // Booked revenue = ALL conversions × ACV (full 12-month contract value)
  // This represents total contract value signed, regardless of when revenue arrives
  const bookedRevenue = totalConversions * avgMonthlyFee * 12;

  // 2026 cash revenue = only from specs that convert within the year
  const annualRevenue = cumulativeRevenue.q4;

  // Avg ACV = full 12-month contract value per client
  const avgACV = avgMonthlyFee * 12;

  return {
    quarterlyRevenue,
    cumulativeRevenue,
    annualRevenue,
    bookedRevenue,
    totalSpecs,              // All specs signed
    totalConversions,        // All conversions (for booked revenue)
    bookedConversions: conversionsThisYear, // Conversions that happen in 2026
    avgACV,
  };
}

/**
 * Calculate total revenue for a single client based on when they signed (for reference)
 */
export function calculateClientAnnualRevenue(
  monthlyFee: number,
  specMonth: number
): number {
  const clientRevenue = calculateClientRevenue(specMonth, monthlyFee);
  return Object.values(clientRevenue).reduce((sum, v) => sum + v, 0);
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
