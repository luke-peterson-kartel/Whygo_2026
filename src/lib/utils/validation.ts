/**
 * Form Validation Utilities for WhyGO Creation
 *
 * Validates WhyGO forms, outcomes, and related data structures
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface WhyGOFormData {
  level: 'company' | 'department' | 'individual';
  department: string | null;
  why: string;
  goal: string;
  parentWhyGOId?: string | null;
  outcomes: OutcomeFormData[];
}

export interface OutcomeFormData {
  description: string;
  annualTarget: number | string;
  unit: string;
  q1Target: number | string;
  q2Target: number | string;
  q3Target: number | string;
  q4Target: number | string;
  ownerId: string;
  ownerName: string;
  sortOrder?: number;
}

/**
 * Validates a complete WhyGO form
 *
 * @param formData - The form data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateWhyGOForm(formData: WhyGOFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate level
  if (!formData.level) {
    errors.push({
      field: 'level',
      message: 'WhyGO level is required',
    });
  }

  // Validate department (required for department-level WhyGOs)
  if (formData.level === 'department' && !formData.department) {
    errors.push({
      field: 'department',
      message: 'Department is required for department-level WhyGOs',
    });
  }

  // Validate WHY statement
  if (!formData.why || formData.why.trim().length === 0) {
    errors.push({
      field: 'why',
      message: 'WHY statement is required',
    });
  } else if (formData.why.trim().length < 100) {
    errors.push({
      field: 'why',
      message: 'WHY statement must be at least 100 characters',
    });
  }

  // Validate GOAL statement
  if (!formData.goal || formData.goal.trim().length === 0) {
    errors.push({
      field: 'goal',
      message: 'GOAL statement is required',
    });
  } else if (formData.goal.trim().length < 50) {
    errors.push({
      field: 'goal',
      message: 'GOAL statement must be at least 50 characters',
    });
  }

  // Validate outcomes
  if (!formData.outcomes || formData.outcomes.length === 0) {
    errors.push({
      field: 'outcomes',
      message: 'At least one outcome is required',
    });
  } else if (formData.outcomes.length > 10) {
    errors.push({
      field: 'outcomes',
      message: 'Maximum of 10 outcomes allowed',
    });
  } else {
    // Validate each outcome
    formData.outcomes.forEach((outcome, index) => {
      const outcomeErrors = validateOutcome(outcome, index);
      errors.push(...outcomeErrors);
    });
  }

  return errors;
}

/**
 * Validates a single outcome
 *
 * @param outcome - The outcome data to validate
 * @param index - The outcome's index (for error messages)
 * @returns Array of validation errors (empty if valid)
 */
export function validateOutcome(outcome: OutcomeFormData, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `outcomes[${index}]`;

  // Validate description
  if (!outcome.description || outcome.description.trim().length === 0) {
    errors.push({
      field: `${prefix}.description`,
      message: `Outcome ${index + 1}: Description is required`,
    });
  } else if (outcome.description.trim().length > 200) {
    errors.push({
      field: `${prefix}.description`,
      message: `Outcome ${index + 1}: Description must be 200 characters or less`,
    });
  }

  // Validate unit
  if (!outcome.unit) {
    errors.push({
      field: `${prefix}.unit`,
      message: `Outcome ${index + 1}: Unit is required`,
    });
  }

  // Validate annual target (if unit requires numeric value)
  const numericUnits = ['USD', 'percentage', 'count'];
  if (numericUnits.includes(outcome.unit)) {
    const annualTarget = parseNumericValue(outcome.annualTarget);
    if (annualTarget === null || isNaN(annualTarget)) {
      errors.push({
        field: `${prefix}.annualTarget`,
        message: `Outcome ${index + 1}: Valid annual target is required`,
      });
    } else if (annualTarget <= 0) {
      errors.push({
        field: `${prefix}.annualTarget`,
        message: `Outcome ${index + 1}: Annual target must be greater than 0`,
      });
    }
  }

  // Validate quarterly targets
  const q1 = parseNumericValue(outcome.q1Target);
  const q2 = parseNumericValue(outcome.q2Target);
  const q3 = parseNumericValue(outcome.q3Target);
  const q4 = parseNumericValue(outcome.q4Target);

  if (q1 === null || isNaN(q1)) {
    errors.push({
      field: `${prefix}.q1Target`,
      message: `Outcome ${index + 1}: Q1 target is required`,
    });
  }

  if (q2 === null || isNaN(q2)) {
    errors.push({
      field: `${prefix}.q2Target`,
      message: `Outcome ${index + 1}: Q2 target is required`,
    });
  }

  if (q3 === null || isNaN(q3)) {
    errors.push({
      field: `${prefix}.q3Target`,
      message: `Outcome ${index + 1}: Q3 target is required`,
    });
  }

  if (q4 === null || isNaN(q4)) {
    errors.push({
      field: `${prefix}.q4Target`,
      message: `Outcome ${index + 1}: Q4 target is required`,
    });
  }

  // Validate quarterly targets sum to annual (±1% tolerance)
  if (
    q1 !== null && !isNaN(q1) &&
    q2 !== null && !isNaN(q2) &&
    q3 !== null && !isNaN(q3) &&
    q4 !== null && !isNaN(q4) &&
    numericUnits.includes(outcome.unit)
  ) {
    const quarterlySum = q1 + q2 + q3 + q4;
    const annualTarget = parseNumericValue(outcome.annualTarget);

    if (annualTarget !== null && !isNaN(annualTarget)) {
      const tolerance = annualTarget * 0.01; // 1% tolerance
      const difference = Math.abs(quarterlySum - annualTarget);

      if (difference > tolerance) {
        errors.push({
          field: `${prefix}.quarterlyTargets`,
          message: `Outcome ${index + 1}: Quarterly targets (${quarterlySum}) must sum to annual target (${annualTarget}) ±1%`,
        });
      }
    }
  }

  // Validate owner
  if (!outcome.ownerId || outcome.ownerId.trim().length === 0) {
    errors.push({
      field: `${prefix}.ownerId`,
      message: `Outcome ${index + 1}: Owner is required`,
    });
  }

  if (!outcome.ownerName || outcome.ownerName.trim().length === 0) {
    errors.push({
      field: `${prefix}.ownerName`,
      message: `Outcome ${index + 1}: Owner name is required`,
    });
  }

  return errors;
}

/**
 * Parses a numeric value from string or number
 *
 * @param value - The value to parse
 * @returns The parsed number or null if invalid
 */
function parseNumericValue(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return null;
    }
    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Auto-distributes an annual target equally across four quarters
 *
 * @param annualTarget - The annual target to distribute
 * @returns Object with Q1-Q4 targets
 */
export function autoDistributeQuarterlyTargets(annualTarget: number): {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
} {
  const quarterlyTarget = Math.round((annualTarget / 4) * 100) / 100; // Round to 2 decimals
  return {
    q1: quarterlyTarget,
    q2: quarterlyTarget,
    q3: quarterlyTarget,
    q4: quarterlyTarget,
  };
}
