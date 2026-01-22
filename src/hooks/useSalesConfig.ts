import { useMemo } from 'react';
import { useSalesWhyGOData } from './useSalesWhyGOData';

/**
 * Default sales configuration values
 * These are used as fallbacks when WhyGO data is not available
 */
export const SALES_DEFAULTS = {
  // Cumulative quarterly revenue targets
  quarterlyRevenue: {
    q1: 1500000,  // $1.5M
    q2: 3500000,  // $3.5M cumulative
    q3: 5500000,  // $5.5M cumulative
    q4: 7000000,  // $7M cumulative (EOY target)
  },
  // Quarterly specs targets (non-cumulative)
  quarterlySpecs: {
    q1: 4,
    q2: 6,
    q3: 4,
    q4: 4,
  },
  // Quarterly conversion targets (non-cumulative)
  quarterlyConversions: {
    q1: 0,
    q2: 3,
    q3: 5,
    q4: 6,
  },
  // Other defaults
  conversionRate: 0.75,
  avgMonthlyFee: 75000,
  totalSpecs: 18,
  totalConversions: 14,
} as const;

export interface QuarterData {
  specs: number;
  conversions: number;
  revenue: number;
}

export interface SalesConfigData {
  // WhyGO metadata
  whygoId: string | null;
  whygoGoal: string | null;
  ownerName: string | null;

  // Quarterly targets (with defaults applied)
  targets: {
    q1: QuarterData;
    q2: QuarterData;
    q3: QuarterData;
    q4: QuarterData;
  };

  // Quarterly actuals (null means not yet recorded)
  actuals: {
    q1: { specs: number | null; conversions: number | null; revenue: number | null };
    q2: { specs: number | null; conversions: number | null; revenue: number | null };
    q3: { specs: number | null; conversions: number | null; revenue: number | null };
    q4: { specs: number | null; conversions: number | null; revenue: number | null };
  };

  // Cumulative targets (for progress tracking)
  cumulativeTargets: {
    q1: QuarterData;
    q2: QuarterData;
    q3: QuarterData;
    q4: QuarterData;
  };

  // Summary values
  eoyRevenueTarget: number;
  totalSpecsTarget: number;
  totalConversionsTarget: number;
  conversionRateTarget: number;
  avgMonthlyFee: number;

  // State
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  // Indicates if we're using real WhyGO data vs defaults
  hasWhyGOData: boolean;
}

/**
 * Centralized hook for Sales configuration data
 *
 * This is the single source of truth for sales targets and actuals.
 * All forecasting components should use this hook instead of directly
 * accessing WHYGO_QUARTERLY_TARGETS or useSalesWhyGOData.
 *
 * Priority:
 * 1. WhyGO outcome targets (if available)
 * 2. SALES_DEFAULTS fallbacks
 */
export function useSalesConfig(year: number = 2026): SalesConfigData {
  const {
    whygoId,
    whygoGoal,
    ownerName,
    targets: rawTargets,
    actuals: rawActuals,
    loading,
    error,
    refetch
  } = useSalesWhyGOData(year);

  const config = useMemo((): Omit<SalesConfigData, 'loading' | 'error' | 'refetch'> => {
    // Check if we have any real WhyGO data
    const hasWhyGOData = !!(
      rawTargets.q1.revenue > 0 ||
      rawTargets.q2.revenue > 0 ||
      rawTargets.q3.revenue > 0 ||
      rawTargets.q4.revenue > 0 ||
      rawTargets.q1.specs > 0 ||
      rawTargets.q2.specs > 0
    );

    // Build quarterly targets with defaults applied
    const getQuarterTargets = (q: 'q1' | 'q2' | 'q3' | 'q4'): QuarterData => ({
      specs: rawTargets[q].specs > 0 ? rawTargets[q].specs : SALES_DEFAULTS.quarterlySpecs[q],
      conversions: rawTargets[q].conversions > 0 ? rawTargets[q].conversions : SALES_DEFAULTS.quarterlyConversions[q],
      revenue: rawTargets[q].revenue > 0 ? rawTargets[q].revenue : SALES_DEFAULTS.quarterlyRevenue[q],
    });

    const targets = {
      q1: getQuarterTargets('q1'),
      q2: getQuarterTargets('q2'),
      q3: getQuarterTargets('q3'),
      q4: getQuarterTargets('q4'),
    };

    // Calculate cumulative targets
    const cumulativeTargets = {
      q1: {
        specs: targets.q1.specs,
        conversions: targets.q1.conversions,
        revenue: targets.q1.revenue,
      },
      q2: {
        specs: targets.q1.specs + targets.q2.specs,
        conversions: targets.q1.conversions + targets.q2.conversions,
        revenue: targets.q2.revenue, // Revenue targets are already cumulative
      },
      q3: {
        specs: targets.q1.specs + targets.q2.specs + targets.q3.specs,
        conversions: targets.q1.conversions + targets.q2.conversions + targets.q3.conversions,
        revenue: targets.q3.revenue,
      },
      q4: {
        specs: targets.q1.specs + targets.q2.specs + targets.q3.specs + targets.q4.specs,
        conversions: targets.q1.conversions + targets.q2.conversions + targets.q3.conversions + targets.q4.conversions,
        revenue: targets.q4.revenue,
      },
    };

    // Summary values
    const eoyRevenueTarget = targets.q4.revenue;
    const totalSpecsTarget = cumulativeTargets.q4.specs;
    const totalConversionsTarget = cumulativeTargets.q4.conversions;

    return {
      whygoId,
      whygoGoal,
      ownerName,
      targets,
      actuals: rawActuals,
      cumulativeTargets,
      eoyRevenueTarget,
      totalSpecsTarget,
      totalConversionsTarget,
      conversionRateTarget: SALES_DEFAULTS.conversionRate,
      avgMonthlyFee: SALES_DEFAULTS.avgMonthlyFee,
      hasWhyGOData,
    };
  }, [whygoId, whygoGoal, ownerName, rawTargets, rawActuals]);

  return {
    ...config,
    loading,
    error,
    refetch,
  };
}
