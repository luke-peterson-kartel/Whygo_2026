/**
 * WhyGO Markdown Parser
 *
 * Parses markdown files containing WhyGO goal structures and converts them
 * to Firestore-compatible data structures.
 */

import { WhyGO, Outcome, WhyGOLevel, WhyGOStatus } from '@/types/whygo.types';

interface ParsedWhyGO {
  level: WhyGOLevel;
  year: number;
  department?: string;
  ownerId: string;
  ownerName: string;
  why: string;
  goal: string;
  status: WhyGOStatus;
  outcomes: ParsedOutcome[];
  metadata: {
    lastUpdated: string;
    approvedBy?: string[];
  };
}

interface ParsedOutcome {
  description: string;
  annualTarget: string | number;
  unit: string;
  q1Target: string | number;
  q2Target: string | number;
  q3Target: string | number;
  q4Target: string | number;
  ownerId: string;
  ownerName: string;
  sortOrder: number;
}

/**
 * Parse a WhyGO markdown file
 */
export function parseWhyGOMarkdown(content: string, filePath: string): ParsedWhyGO[] {
  const whygos: ParsedWhyGO[] = [];

  // Determine level from file path
  const level = detectLevel(filePath);
  const department = detectDepartment(filePath, level);
  const year = detectYear(content);
  const metadata = extractMetadata(content);

  // Extract all WhyGO sections
  const whygoSections = extractWhyGOSections(content);

  whygoSections.forEach((section, index) => {
    const whygo = parseWhyGOSection(section, {
      level,
      department,
      year,
      metadata,
      sortOrder: index + 1,
    });

    if (whygo) {
      whygos.push(whygo);
    }
  });

  return whygos;
}

/**
 * Detect WhyGO level from file path
 */
function detectLevel(filePath: string): WhyGOLevel {
  if (filePath.includes('Company')) return 'company';
  if (filePath.includes('Department')) return 'department';
  return 'individual';
}

/**
 * Detect department from file path
 */
function detectDepartment(filePath: string, level: WhyGOLevel): string | undefined {
  if (level === 'company') return undefined;

  const departments = ['Sales', 'Production', 'Platform', 'Generative', 'Community'];
  for (const dept of departments) {
    if (filePath.includes(dept)) {
      return dept;
    }
  }

  return undefined;
}

/**
 * Extract year from content
 */
function detectYear(content: string): number {
  const yearMatch = content.match(/202\d/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
}

/**
 * Extract metadata from document header
 */
function extractMetadata(content: string): { lastUpdated: string; status: WhyGOStatus; owner: { id: string; name: string } } {
  const lastUpdatedMatch = content.match(/Last Updated\s*\|\s*(.+)/i);
  const statusMatch = content.match(/Status\s*\|\s*(.+)/i);
  const ownerMatch = content.match(/(?:Goal Owner|Department Head)\s*\|\s*(.+?)(?:,|$)/i);

  // Parse owner name and generate ID
  let ownerId = '';
  let ownerName = '';

  if (ownerMatch) {
    ownerName = ownerMatch[1].trim();
    // Extract first name for ID (e.g., "Kevin Reilly" → "kevin@kartel.ai")
    const firstName = ownerName.split(' ')[0].toLowerCase();
    ownerId = `${firstName}@kartel.ai`;
  }

  // Parse status
  let status: WhyGOStatus = 'draft';
  if (statusMatch) {
    const statusText = statusMatch[1].toLowerCase();
    if (statusText.includes('approved') || statusText.includes('ready for board')) {
      status = 'active';
    } else if (statusText.includes('draft') || statusText.includes('pending')) {
      status = 'draft';
    }
  }

  return {
    lastUpdated: lastUpdatedMatch ? lastUpdatedMatch[1].trim() : 'January 2026',
    status,
    owner: { id: ownerId, name: ownerName },
  };
}

/**
 * Extract WhyGO sections from markdown
 */
function extractWhyGOSections(content: string): string[] {
  // Match sections starting with "## WhyGO #" or "## Company WhyGO #"
  const whygoRegex = /##\s+(?:Company\s+)?WhyGO\s+#\d+[:\s]+.+?(?=##\s+(?:Company\s+)?WhyGO\s+#\d+|##\s+Tracking|##\s+Executive|##\s+Approval|$)/gis;
  const matches = content.match(whygoRegex);

  return matches || [];
}

/**
 * Parse a single WhyGO section
 */
function parseWhyGOSection(
  section: string,
  context: {
    level: WhyGOLevel;
    department?: string;
    year: number;
    metadata: ReturnType<typeof extractMetadata>;
    sortOrder: number;
  }
): ParsedWhyGO | null {
  // Extract WHY statement - handle both formats:
  // Company format: | WHY | content |
  // Department format: | WHY\ncontent |
  let whyMatch = section.match(/\|\s*WHY\s*\|\s*([^|]+?)\s*\|/is);
  if (!whyMatch) {
    // Try multi-line format
    whyMatch = section.match(/\|\s*WHY\s*\n([^|]+?)\s*\|/is);
  }
  if (!whyMatch) return null;

  const why = whyMatch[1].trim();

  // Extract GOAL statement - handle both formats
  let goalMatch = section.match(/\|\s*GOAL\s*\|\s*([^|]+?)\s*\|/is);
  if (!goalMatch) {
    // Try multi-line format
    goalMatch = section.match(/\|\s*GOAL\s*\n([^|]+?)\s*\|/is);
  }
  if (!goalMatch) return null;

  const goal = goalMatch[1].trim();

  // Extract outcomes table
  const outcomes = parseOutcomesTable(section);

  return {
    level: context.level,
    year: context.year,
    department: context.department,
    ownerId: context.metadata.owner.id,
    ownerName: context.metadata.owner.name,
    why,
    goal,
    status: context.metadata.status,
    outcomes,
    metadata: {
      lastUpdated: context.metadata.lastUpdated,
    },
  };
}

/**
 * Parse outcomes table from WhyGO section
 */
function parseOutcomesTable(section: string): ParsedOutcome[] {
  const outcomes: ParsedOutcome[] = [];

  // Find the OUTCOMES section
  const outcomesMatch = section.match(/OUTCOMES\s*\n([\s\S]+?)(?=\n##|$)/i);
  if (!outcomesMatch) return outcomes;

  const outcomesSection = outcomesMatch[1];

  // Parse table rows (skip header rows with | --- |)
  const rows = outcomesSection.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && !trimmed.includes('---') && !trimmed.includes('Outcome');
  });

  rows.forEach((row, index) => {
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);

    // Handle two formats:
    // Company format: | # | Outcome | Annual | Q1 | Q2 | Q3 | Q4 | Owner | (8 columns)
    // Department format: | Outcome | Q1 | Q2 | Q3 | Q4 | Owner | (6 columns)

    let description, q1, q2, q3, q4, ownerName, annual;

    if (cells.length === 8) {
      // Company format with # and Annual columns
      description = cells[1];
      annual = cells[2];
      q1 = cells[3];
      q2 = cells[4];
      q3 = cells[5];
      q4 = cells[6];
      ownerName = cells[7] || '';
    } else if (cells.length === 6) {
      // Department format without # and Annual columns
      description = cells[0];
      annual = 'N/A'; // Department format doesn't have annual target in table
      q1 = cells[1];
      q2 = cells[2];
      q3 = cells[3];
      q4 = cells[4];
      ownerName = cells[5] || '';
    } else {
      // Skip rows that don't match expected formats
      return;
    }

    // Generate owner email
    const firstName = ownerName.split(' ')[0].toLowerCase();
    const ownerId = firstName ? `${firstName}@kartel.ai` : '';

    outcomes.push({
      description,
      annualTarget: parseValue(annual),
      unit: detectUnit(annual),
      q1Target: parseValue(q1),
      q2Target: parseValue(q2),
      q3Target: parseValue(q3),
      q4Target: parseValue(q4),
      ownerId,
      ownerName,
      sortOrder: index + 1,
    });
  });

  return outcomes;
}

/**
 * Parse a value (number, percentage, currency, or string)
 */
function parseValue(value: string): string | number {
  // Remove common formatting
  const cleaned = value.replace(/[$,]/g, '').trim();

  // Try to parse as number
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return num;
  }

  // Return as string for qualitative values
  return value.trim();
}

/**
 * Detect unit from value string
 */
function detectUnit(value: string): string {
  if (value.includes('$')) return 'USD';
  if (value.includes('%')) return 'percentage';
  if (value.includes('+')) return 'count';
  if (/^\d+$/.test(value.trim())) return 'count';

  return 'text';
}

/**
 * Generate a unique ID for a WhyGO
 */
export function generateWhyGOId(whygo: ParsedWhyGO): string {
  const prefix = whygo.level === 'company' ? 'cg' : whygo.level === 'department' ? 'dg' : 'ig';
  const dept = whygo.department ? `_${whygo.department.toLowerCase()}` : '';
  const year = whygo.year.toString().slice(-2);
  const random = Math.random().toString(36).substring(2, 6);

  return `${prefix}${dept}_${year}_${random}`;
}

/**
 * Generate a unique ID for an outcome
 */
export function generateOutcomeId(whygoId: string, outcomeIndex: number): string {
  return `${whygoId}_o${outcomeIndex}`;
}
