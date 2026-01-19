import { Timestamp } from 'firebase/firestore';

export type WhyGOLevel = 'company' | 'department' | 'individual';
export type WhyGOStatus = 'draft' | 'active' | 'completed' | 'archived';
export type StatusIndicator = '+' | '~' | '-' | null;
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface WhyGO {
  id: string;
  level: WhyGOLevel;
  year: number;
  department: string | null;
  ownerId: string;
  ownerName: string;

  why: string;
  goal: string;

  parentWhyGOId: string | null;

  status: WhyGOStatus;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  approvedBy: string | null;
  approvedAt: Timestamp | null;
}

export interface Outcome {
  id: string;
  whygoId: string;
  description: string;
  annualTarget: number;
  unit: string;

  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;

  q1Actual: number | null;
  q2Actual: number | null;
  q3Actual: number | null;
  q4Actual: number | null;

  q1Status: StatusIndicator;
  q2Status: StatusIndicator;
  q3Status: StatusIndicator;
  q4Status: StatusIndicator;

  ownerId: string;
  ownerName: string;

  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProgressUpdate {
  id: string;
  outcomeId: string;
  whygoId: string;
  quarter: Quarter;
  year: number;
  actualValue: number;
  targetValue: number;
  status: StatusIndicator;
  notes: string | null;
  updatedBy: string;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  whygoId: string;
  reviewType: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  quarter: Quarter | null;
  year: number;
  reviewDate: Timestamp;
  reviewedBy: string;
  notes: string;
  attendees: string[];
  blockers: string[];
  createdAt: Timestamp;
}

export interface Alignment {
  id: string;
  childWhyGOId: string;
  parentWhyGOId: string;
  alignmentStrength: 'primary' | 'secondary' | 'supporting';
  notes: string | null;
  createdAt: Timestamp;
}

export interface WhyGOWithOutcomes extends WhyGO {
  outcomes: Outcome[];
}

export interface WhyGOFormData {
  level: WhyGOLevel;
  why: string;
  goal: string;
  department: string | null;
  parentWhyGOId: string | null;
  outcomes: OutcomeFormData[];
}

export interface OutcomeFormData {
  description: string;
  annualTarget: number;
  unit: string;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
  ownerId: string;
  ownerName: string;
}
