import { WhyGOWithOutcomes, Outcome } from '@/types/whygo.types';
import { calculateWhyGOHealth } from './statusCalculator';

export interface WhyGOAnalytics {
  health: {
    overallStatus: '+' | '~' | '-' | null;
    onTrack: number;
    slightlyOff: number;
    offTrack: number;
    notStarted: number;
    total: number;
  };
  ytdCompletion: {
    percentage: number;
    totalActual: number;
    totalTarget: number;
  };
  daysUntilQuarterEnd: number;
  currentQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
}

/**
 * Calculate comprehensive analytics for a WhyGO
 */
export function calculateWhyGOAnalytics(whygo: WhyGOWithOutcomes): WhyGOAnalytics {
  const health = calculateWhyGOHealth(whygo.outcomes);
  const currentQuarter = getCurrentQuarter();
  const ytdCompletion = calculateYTDCompletion(whygo.outcomes, currentQuarter);
  const daysUntilQuarterEnd = calculateDaysUntilQuarterEnd();

  return {
    health: {
      ...health,
      total: whygo.outcomes.length,
    },
    ytdCompletion,
    daysUntilQuarterEnd,
    currentQuarter,
  };
}

/**
 * Get the current quarter based on today's date
 */
function getCurrentQuarter(): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
  const now = new Date();
  const month = now.getMonth(); // 0-11

  if (month >= 0 && month <= 2) return 'Q1';
  if (month >= 3 && month <= 5) return 'Q2';
  if (month >= 6 && month <= 8) return 'Q3';
  return 'Q4';
}

/**
 * Calculate YTD completion percentage
 */
function calculateYTDCompletion(
  outcomes: Outcome[],
  currentQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
): { percentage: number; totalActual: number; totalTarget: number } {
  let totalActual = 0;
  let totalTarget = 0;

  outcomes.forEach((outcome) => {
    // Sum up actual values through current quarter
    const quarters: Array<'q1' | 'q2' | 'q3' | 'q4'> = [];
    if (currentQuarter === 'Q1') quarters.push('q1');
    if (currentQuarter === 'Q2') quarters.push('q1', 'q2');
    if (currentQuarter === 'Q3') quarters.push('q1', 'q2', 'q3');
    if (currentQuarter === 'Q4') quarters.push('q1', 'q2', 'q3', 'q4');

    quarters.forEach((q) => {
      const actualField = `${q}Actual` as keyof Outcome;
      const targetField = `${q}Target` as keyof Outcome;

      const actual = outcome[actualField];
      const target = outcome[targetField];

      // Only sum numeric values
      if (typeof actual === 'number') {
        totalActual += actual;
      }
      if (typeof target === 'number') {
        totalTarget += target;
      }
    });
  });

  const percentage = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

  return {
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
    totalActual,
    totalTarget,
  };
}

/**
 * Calculate days until the end of current quarter
 */
function calculateDaysUntilQuarterEnd(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11

  let quarterEndDate: Date;

  if (month >= 0 && month <= 2) {
    // Q1 ends March 31
    quarterEndDate = new Date(year, 2, 31);
  } else if (month >= 3 && month <= 5) {
    // Q2 ends June 30
    quarterEndDate = new Date(year, 5, 30);
  } else if (month >= 6 && month <= 8) {
    // Q3 ends September 30
    quarterEndDate = new Date(year, 8, 30);
  } else {
    // Q4 ends December 31
    quarterEndDate = new Date(year, 11, 31);
  }

  const diffTime = quarterEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays); // Don't return negative days
}
