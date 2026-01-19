import type { StatusIndicator, Quarter, Outcome } from '@/types/whygo.types';

/**
 * Calculate status based on actual vs target
 * [+] On pace: ≥100% of target
 * [~] Slightly off: 80-99% of target
 * [-] Off pace: <80% of target
 */
export function calculateStatus(
  actual: number | null,
  target: number
): StatusIndicator {
  if (actual === null || target === 0) {
    return null;
  }

  const percentage = (actual / target) * 100;

  if (percentage >= 100) return '+';
  if (percentage >= 80) return '~';
  return '-';
}

/**
 * Get current quarter based on today's date
 */
export function getCurrentQuarter(): Quarter {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12

  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
}

/**
 * Calculate current quarter status for an outcome
 */
export function getCurrentQuarterStatus(outcome: Outcome): {
  quarter: Quarter;
  status: StatusIndicator;
  actual: number | null;
  target: number;
} {
  const quarter = getCurrentQuarter();

  const quarterKey = quarter.toLowerCase() as 'q1' | 'q2' | 'q3' | 'q4';
  const actual = outcome[`${quarterKey}Actual`];
  const target = outcome[`${quarterKey}Target`];
  const status = outcome[`${quarterKey}Status`];

  return { quarter, status, actual, target };
}

/**
 * Calculate overall WhyGO health based on outcomes
 */
export function calculateWhyGOHealth(outcomes: Outcome[]): {
  overallStatus: StatusIndicator;
  onTrack: number;
  slightlyOff: number;
  offTrack: number;
  notStarted: number;
} {
  if (outcomes.length === 0) {
    return { overallStatus: null, onTrack: 0, slightlyOff: 0, offTrack: 0, notStarted: 0 };
  }

  const currentStatuses = outcomes.map(o => getCurrentQuarterStatus(o).status);

  const onTrack = currentStatuses.filter(s => s === '+').length;
  const slightlyOff = currentStatuses.filter(s => s === '~').length;
  const offTrack = currentStatuses.filter(s => s === '-').length;
  const notStarted = currentStatuses.filter(s => s === null).length;

  // Overall status logic
  let overallStatus: StatusIndicator;
  if (offTrack > 0) {
    overallStatus = '-';
  } else if (slightlyOff > outcomes.length / 2) {
    overallStatus = '~';
  } else if (onTrack === outcomes.length) {
    overallStatus = '+';
  } else if (notStarted === outcomes.length) {
    overallStatus = null;
  } else {
    overallStatus = '~';
  }

  return { overallStatus, onTrack, slightlyOff, offTrack, notStarted };
}

/**
 * Get quarter number (1-4) from Quarter enum
 */
export function getQuarterNumber(quarter: Quarter): number {
  return parseInt(quarter.substring(1));
}

/**
 * Get all quarters up to and including current quarter
 */
export function getCompletedQuarters(): Quarter[] {
  const current = getCurrentQuarter();
  const currentNum = getQuarterNumber(current);
  const quarters: Quarter[] = [];

  for (let i = 1; i <= currentNum; i++) {
    quarters.push(`Q${i}` as Quarter);
  }

  return quarters;
}

/**
 * Calculate cumulative progress through current quarter
 */
export function getCumulativeProgress(outcome: Outcome): {
  actualTotal: number;
  targetTotal: number;
  percentage: number;
} {
  const completedQuarters = getCompletedQuarters();
  let actualTotal = 0;
  let targetTotal = 0;

  for (const quarter of completedQuarters) {
    const quarterKey = quarter.toLowerCase() as 'q1' | 'q2' | 'q3' | 'q4';
    actualTotal += outcome[`${quarterKey}Actual`] || 0;
    targetTotal += outcome[`${quarterKey}Target`];
  }

  const percentage = targetTotal > 0 ? (actualTotal / targetTotal) * 100 : 0;

  return { actualTotal, targetTotal, percentage };
}
