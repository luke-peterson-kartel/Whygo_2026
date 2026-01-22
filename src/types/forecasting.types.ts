import { Timestamp } from 'firebase/firestore';

// Scenario types
export type ScenarioType = 'baseline' | 'optimistic' | 'conservative' | 'custom';

// Deal pipeline stages
export type DealStage = 'prospect' | 'spec_signed' | 'in_spec' | 'decision' | 'converted' | 'lost';

// Quarterly data structure
export interface QuarterlyData {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

// Month number (1-12)
export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Monthly specs structure - specs closing each month
export interface MonthlySpecs {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

// Forecasting scenario inputs
export interface ScenarioInputs {
  specsPerMonth: MonthlySpecs;   // Specs closing each month
  conversionRate: number;        // 0-1 (e.g., 0.75 = 75%)
  avgMonthlyFee: number;         // e.g., 75000
}

// Forecasting scenario calculated outputs
export interface ScenarioOutputs {
  quarterlyRevenue: QuarterlyData;
  cumulativeRevenue: QuarterlyData;
  annualRevenue: number;
  bookedRevenue: number;           // Revenue from specs already converted (based on current month)
  totalSpecs: number;
  totalConversions: number;
  bookedConversions: number;       // Conversions already happened (based on current month)
  avgACV: number;
}

// Full forecasting scenario document
export interface ForecastingScenario {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  year: number;
  isActive: boolean;
  inputs: ScenarioInputs;
  outputs: ScenarioOutputs;
  createdBy: string;
  createdByName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Pipeline deal document
export interface PipelineDeal {
  id: string;
  companyName: string;
  contactName: string;
  stage: DealStage;
  probability: number;           // 0-100
  monthlyFee: number;
  specSignedDate: Timestamp | null;
  expectedConversionDate: Timestamp | null;
  brandTier?: string;            // Future: tier integration
  notes: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Forecasting actuals (linked to WhyGO outcomes)
export interface ForecastingActual {
  id: string;
  year: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  specsStarted: number;
  specsConverted: number;
  revenue: number;
  isManualOverride: boolean;
  linkedOutcomeIds: string[];
  updatedBy: string;
  updatedAt: Timestamp;
}

// Default probabilities by stage
export const STAGE_PROBABILITIES: Record<DealStage, number> = {
  prospect: 10,
  spec_signed: 25,
  in_spec: 50,
  decision: 75,
  converted: 100,
  lost: 0,
};

// Stage display configuration
export const STAGE_CONFIG: Record<DealStage, { label: string; color: string }> = {
  prospect: { label: 'Prospect', color: 'gray' },
  spec_signed: { label: 'Spec Signed', color: 'blue' },
  in_spec: { label: 'In Spec', color: 'indigo' },
  decision: { label: 'Decision', color: 'amber' },
  converted: { label: 'Converted', color: 'green' },
  lost: { label: 'Lost', color: 'red' },
};

// Default baseline scenario inputs (matching Sales WhyGO targets - 18 specs distributed)
export const DEFAULT_SCENARIO_INPUTS: ScenarioInputs = {
  specsPerMonth: {
    jan: 0,   // No specs close in Jan (just starting the year)
    feb: 2,
    mar: 2,
    apr: 2,
    may: 2,
    jun: 2,
    jul: 2,
    aug: 1,
    sep: 1,
    oct: 4,   // Q4 push
    nov: 0,   // Nov/Dec specs won't convert until next year
    dec: 0,
  },
  conversionRate: 0.75,
  avgMonthlyFee: 75000,
};

// Month labels for UI
export const MONTH_LABELS: Record<MonthNumber, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

// WhyGO quarterly targets for reference
export const WHYGO_QUARTERLY_TARGETS: QuarterlyData = {
  q1: 1500000,  // $1.5M
  q2: 3500000,  // $3.5M cumulative
  q3: 5500000,  // $5.5M cumulative
  q4: 7000000,  // $7M cumulative
};
