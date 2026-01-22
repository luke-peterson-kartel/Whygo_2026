import { useMemo } from 'react';
import { useWhyGOs } from './useWhyGOs';
import type { Outcome } from '@/types/whygo.types';

export interface QuarterActuals {
  specs: number | null;
  conversions: number | null;
  revenue: number | null;
}

export interface QuarterTargets {
  specs: number;
  conversions: number;
  revenue: number;
}

export interface SalesWhyGOData {
  // WhyGO metadata
  whygoId: string | null;
  whygoGoal: string | null;
  ownerName: string | null;

  // Quarterly actuals
  actuals: {
    q1: QuarterActuals;
    q2: QuarterActuals;
    q3: QuarterActuals;
    q4: QuarterActuals;
  };

  // Quarterly targets (from outcomes)
  targets: {
    q1: QuarterTargets;
    q2: QuarterTargets;
    q3: QuarterTargets;
    q4: QuarterTargets;
  };

  // Raw outcomes for reference
  specsOutcome: Outcome | null;
  conversionsOutcome: Outcome | null;
  revenueOutcome: Outcome | null;

  // Loading/error state
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Helper to parse numeric values from outcome fields
function parseNumeric(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;
  // Remove currency symbols, commas, etc.
  const cleaned = String(value).replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Helper to parse target values (should always be a number, fallback to 0)
function parseTarget(value: string | number | null | undefined): number {
  const num = parseNumeric(value);
  return num ?? 0;
}

/**
 * Hook to fetch Sales department WhyGO data for Plan vs Actual tracking
 * Looks for outcomes related to specs, conversions, and revenue
 */
export function useSalesWhyGOData(year: number = 2026): SalesWhyGOData {
  const { whygos, loading, error, refetch } = useWhyGOs({
    level: 'department',
    department: 'Sales',
    year,
    status: ['draft', 'active'],
  });

  const data = useMemo(() => {
    // Default empty state
    const emptyActuals: QuarterActuals = { specs: null, conversions: null, revenue: null };
    const emptyTargets: QuarterTargets = { specs: 0, conversions: 0, revenue: 0 };

    if (loading || whygos.length === 0) {
      return {
        whygoId: null,
        whygoGoal: null,
        ownerName: null,
        actuals: { q1: emptyActuals, q2: emptyActuals, q3: emptyActuals, q4: emptyActuals },
        targets: { q1: emptyTargets, q2: emptyTargets, q3: emptyTargets, q4: emptyTargets },
        specsOutcome: null,
        conversionsOutcome: null,
        revenueOutcome: null,
      };
    }

    // Find the primary Sales WhyGO (the one about enterprise specs/revenue)
    // Look for keywords in the goal
    const salesWhyGO = whygos.find(w =>
      w.goal?.toLowerCase().includes('spec') ||
      w.goal?.toLowerCase().includes('enterprise') ||
      w.goal?.toLowerCase().includes('revenue') ||
      w.goal?.toLowerCase().includes('client')
    ) || whygos[0]; // Fallback to first Sales WhyGO

    if (!salesWhyGO) {
      return {
        whygoId: null,
        whygoGoal: null,
        ownerName: null,
        actuals: { q1: emptyActuals, q2: emptyActuals, q3: emptyActuals, q4: emptyActuals },
        targets: { q1: emptyTargets, q2: emptyTargets, q3: emptyTargets, q4: emptyTargets },
        specsOutcome: null,
        conversionsOutcome: null,
        revenueOutcome: null,
      };
    }

    const outcomes = salesWhyGO.outcomes || [];

    // Find relevant outcomes by description/unit
    // Specs: look for "spec" in description
    const specsOutcome = outcomes.find(o =>
      o.description?.toLowerCase().includes('spec')
    ) || null;

    // Conversions: look for "conversion" or "convert" in description
    const conversionsOutcome = outcomes.find(o =>
      o.description?.toLowerCase().includes('convert') ||
      o.description?.toLowerCase().includes('conversion')
    ) || null;

    // Revenue: look for "revenue" in description or "$" in unit
    const revenueOutcome = outcomes.find(o =>
      o.description?.toLowerCase().includes('revenue') ||
      o.unit?.includes('$') ||
      o.unit?.toLowerCase().includes('dollar')
    ) || null;

    // Build quarterly data
    const buildQuarterActuals = (q: 'q1' | 'q2' | 'q3' | 'q4'): QuarterActuals => ({
      specs: specsOutcome ? parseNumeric(specsOutcome[`${q}Actual`]) : null,
      conversions: conversionsOutcome ? parseNumeric(conversionsOutcome[`${q}Actual`]) : null,
      revenue: revenueOutcome ? parseNumeric(revenueOutcome[`${q}Actual`]) : null,
    });

    const buildQuarterTargets = (q: 'q1' | 'q2' | 'q3' | 'q4'): QuarterTargets => ({
      specs: specsOutcome ? parseTarget(specsOutcome[`${q}Target`]) : 0,
      conversions: conversionsOutcome ? parseTarget(conversionsOutcome[`${q}Target`]) : 0,
      revenue: revenueOutcome ? parseTarget(revenueOutcome[`${q}Target`]) : 0,
    });

    return {
      whygoId: salesWhyGO.id,
      whygoGoal: salesWhyGO.goal,
      ownerName: salesWhyGO.ownerName,
      actuals: {
        q1: buildQuarterActuals('q1'),
        q2: buildQuarterActuals('q2'),
        q3: buildQuarterActuals('q3'),
        q4: buildQuarterActuals('q4'),
      },
      targets: {
        q1: buildQuarterTargets('q1'),
        q2: buildQuarterTargets('q2'),
        q3: buildQuarterTargets('q3'),
        q4: buildQuarterTargets('q4'),
      },
      specsOutcome,
      conversionsOutcome,
      revenueOutcome,
    };
  }, [whygos, loading]);

  return {
    ...data,
    loading,
    error,
    refetch,
  };
}
