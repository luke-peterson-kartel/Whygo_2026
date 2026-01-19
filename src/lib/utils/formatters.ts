import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';
import type { StatusIndicator, Quarter } from '@/types/whygo.types';

/**
 * Format a Firestore Timestamp to a readable date string
 */
export function formatDate(timestamp: Timestamp | Date, formatStr: string = 'MMM d, yyyy'): string {
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  return format(date, formatStr);
}

/**
 * Format a number with unit (e.g., "$7M", "50%", "10 clients")
 */
export function formatValue(value: number, unit: string): string {
  if (unit === '$') {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  }

  if (unit === '%') {
    return `${value}%`;
  }

  if (unit === 'M') {
    return `${value}M`;
  }

  if (unit === 'K') {
    return `${value}K`;
  }

  if (unit === 'count') {
    return value.toString();
  }

  return `${value} ${unit}`;
}

/**
 * Format status indicator as badge text
 */
export function formatStatusBadge(status: StatusIndicator): string {
  if (status === '+') return 'On Pace';
  if (status === '~') return 'Slightly Off';
  if (status === '-') return 'Off Pace';
  return 'Not Started';
}

/**
 * Get color class for status indicator
 */
export function getStatusColor(status: StatusIndicator): string {
  if (status === '+') return 'text-green-700 bg-green-100';
  if (status === '~') return 'text-yellow-700 bg-yellow-100';
  if (status === '-') return 'text-red-700 bg-red-100';
  return 'text-gray-700 bg-gray-100';
}

/**
 * Get status icon
 */
export function getStatusIcon(status: StatusIndicator): string {
  if (status === '+') return '✓';
  if (status === '~') return '~';
  if (status === '-') return '✗';
  return '○';
}

/**
 * Format quarter name
 */
export function formatQuarter(quarter: Quarter, year?: number): string {
  if (year) {
    return `${quarter} ${year}`;
  }
  return quarter;
}

/**
 * Calculate percentage and format it
 */
export function formatPercentage(actual: number, target: number): string {
  if (target === 0) return 'N/A';
  const percentage = (actual / target) * 100;
  return `${Math.round(percentage)}%`;
}

/**
 * Format employee level for display
 */
export function formatEmployeeLevel(level: string): string {
  const levelMap: Record<string, string> = {
    executive: 'Executive',
    department_head: 'Department Head',
    manager: 'Manager',
    ic: 'Individual Contributor',
  };
  return levelMap[level] || level;
}

/**
 * Format WhyGO level for display
 */
export function formatWhyGOLevel(level: string): string {
  const levelMap: Record<string, string> = {
    company: 'Company',
    department: 'Department',
    individual: 'Individual',
  };
  return levelMap[level] || level;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
