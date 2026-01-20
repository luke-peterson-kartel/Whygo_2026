/**
 * ID Generation Utilities for WhyGOs and Outcomes
 *
 * Generates unique, human-readable IDs with the following patterns:
 * - Company WhyGO: "cg_26_a7k2"
 * - Department WhyGO: "dg_sales_26_b3m1"
 * - Individual WhyGO: "ig_26_c5p9"
 * - Outcome: "cg_26_a7k2_o1"
 */

export interface WhyGOIdParams {
  level: 'company' | 'department' | 'individual';
  department?: string;
  year?: number;
}

/**
 * Generates a unique WhyGO ID based on level, department, and year
 *
 * @param params - WhyGO identification parameters
 * @returns A unique ID string
 *
 * @example
 * generateWhyGOId({ level: 'company', year: 2026 }) // "cg_26_a7k2"
 * generateWhyGOId({ level: 'department', department: 'Sales', year: 2026 }) // "dg_sales_26_b3m1"
 * generateWhyGOId({ level: 'individual', year: 2026 }) // "ig_26_c5p9"
 */
export function generateWhyGOId(params: WhyGOIdParams): string {
  const { level, department, year = new Date().getFullYear() } = params;

  // Determine prefix based on level
  const prefix = level === 'company' ? 'cg' : level === 'department' ? 'dg' : 'ig';

  // Add department suffix if present
  const deptSuffix = department ? `_${department.toLowerCase().replace(/\s+/g, '')}` : '';

  // Get last 2 digits of year
  const yearSuffix = year.toString().slice(-2);

  // Generate random 4-character suffix
  const randomSuffix = Math.random().toString(36).substring(2, 6);

  return `${prefix}${deptSuffix}_${yearSuffix}_${randomSuffix}`;
}

/**
 * Generates a unique Outcome ID based on parent WhyGO ID and outcome number
 *
 * @param whygoId - The parent WhyGO's ID
 * @param outcomeNumber - The 1-based outcome number (e.g., 1, 2, 3)
 * @returns A unique outcome ID string
 *
 * @example
 * generateOutcomeId('cg_26_a7k2', 1) // "cg_26_a7k2_o1"
 * generateOutcomeId('dg_sales_26_b3m1', 2) // "dg_sales_26_b3m1_o2"
 */
export function generateOutcomeId(whygoId: string, outcomeNumber: number): string {
  return `${whygoId}_o${outcomeNumber}`;
}

/**
 * Parses a WhyGO ID to extract metadata
 *
 * @param whygoId - The WhyGO ID to parse
 * @returns Parsed metadata or null if invalid
 *
 * @example
 * parseWhyGOId('cg_26_a7k2') // { level: 'company', year: 2026, department: null }
 * parseWhyGOId('dg_sales_26_b3m1') // { level: 'department', year: 2026, department: 'sales' }
 */
export function parseWhyGOId(whygoId: string): {
  level: 'company' | 'department' | 'individual';
  year: number;
  department: string | null;
} | null {
  const parts = whygoId.split('_');

  if (parts.length < 3) {
    return null;
  }

  const prefix = parts[0];
  let level: 'company' | 'department' | 'individual';

  switch (prefix) {
    case 'cg':
      level = 'company';
      break;
    case 'dg':
      level = 'department';
      break;
    case 'ig':
      level = 'individual';
      break;
    default:
      return null;
  }

  // For department goals, department name is between prefix and year
  const hasDepartment = parts.length > 3;
  const department = hasDepartment ? parts[1] : null;
  const yearIndex = hasDepartment ? 2 : 1;
  const yearStr = parts[yearIndex];
  const year = 2000 + parseInt(yearStr, 10);

  return {
    level,
    year,
    department,
  };
}
