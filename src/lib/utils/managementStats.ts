import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { calculateWhyGOHealth } from './statusCalculator';

export interface ManagementMetrics {
  totalGoals: number;
  totalOutcomes: number;
  pendingApprovals: number;
  overallHealth: {
    onTrack: number;
    slightlyOff: number;
    offTrack: number;
    notStarted: number;
  };
  pendingApprovalsList: WhyGOWithOutcomes[];
  departmentStats: DepartmentStat[];
  quarterlyBreakdown: QuarterlyStats[];
}

export interface DepartmentStat {
  name: string;
  goalCount: number;
  health: {
    onTrack: number;
    slightlyOff: number;
    offTrack: number;
    notStarted: number;
  };
  whygos: WhyGOWithOutcomes[];
}

export interface QuarterlyStats {
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  quarterLabel: string;
  onTrack: number;
  slightlyOff: number;
  offTrack: number;
  notStarted: number;
  total: number;
}

/**
 * Calculate all management dashboard metrics from WhyGOs
 */
export function calculateManagementMetrics(whygos: WhyGOWithOutcomes[]): ManagementMetrics {
  // Total goals
  const totalGoals = whygos.length;

  // Total outcomes
  const totalOutcomes = whygos.reduce((sum, whygo) => sum + whygo.outcomes.length, 0);

  // Pending approvals
  const pendingApprovalsList = whygos.filter(
    (whygo) => whygo.approvedBy === null && whygo.status === 'draft'
  );
  const pendingApprovals = pendingApprovalsList.length;

  // Overall health (aggregate all outcomes)
  const overallHealth = {
    onTrack: 0,
    slightlyOff: 0,
    offTrack: 0,
    notStarted: 0,
  };

  whygos.forEach((whygo) => {
    const health = calculateWhyGOHealth(whygo.outcomes);
    overallHealth.onTrack += health.onTrack;
    overallHealth.slightlyOff += health.slightlyOff;
    overallHealth.offTrack += health.offTrack;
    overallHealth.notStarted += health.notStarted;
  });

  // Department stats
  const departmentStats = calculateDepartmentStats(whygos);

  // Quarterly breakdown
  const quarterlyBreakdown = getQuarterlyBreakdown(whygos);

  return {
    totalGoals,
    totalOutcomes,
    pendingApprovals,
    overallHealth,
    pendingApprovalsList,
    departmentStats,
    quarterlyBreakdown,
  };
}

/**
 * Calculate stats grouped by department
 */
export function calculateDepartmentStats(whygos: WhyGOWithOutcomes[]): DepartmentStat[] {
  // Get unique departments from WhyGOs
  const departmentMap = new Map<string, WhyGOWithOutcomes[]>();

  whygos.forEach((whygo) => {
    // Only include department-level WhyGOs (not company or individual)
    if (whygo.level === 'department' && whygo.department) {
      const deptWhyGOs = departmentMap.get(whygo.department) || [];
      deptWhyGOs.push(whygo);
      departmentMap.set(whygo.department, deptWhyGOs);
    }
  });

  // Calculate stats for each department
  const stats: DepartmentStat[] = [];

  departmentMap.forEach((deptWhyGOs, department) => {
    const health = {
      onTrack: 0,
      slightlyOff: 0,
      offTrack: 0,
      notStarted: 0,
    };

    // Aggregate health across all department WhyGOs
    deptWhyGOs.forEach((whygo) => {
      const whygoHealth = calculateWhyGOHealth(whygo.outcomes);
      health.onTrack += whygoHealth.onTrack;
      health.slightlyOff += whygoHealth.slightlyOff;
      health.offTrack += whygoHealth.offTrack;
      health.notStarted += whygoHealth.notStarted;
    });

    stats.push({
      name: department,
      goalCount: deptWhyGOs.length,
      health,
      whygos: deptWhyGOs,
    });
  });

  // Sort by department name
  return stats.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get quarterly breakdown of outcome statuses
 */
export function getQuarterlyBreakdown(whygos: WhyGOWithOutcomes[]): QuarterlyStats[] {
  const quarters: Array<{ quarter: 'q1' | 'q2' | 'q3' | 'q4'; label: string }> = [
    { quarter: 'q1', label: 'Q1' },
    { quarter: 'q2', label: 'Q2' },
    { quarter: 'q3', label: 'Q3' },
    { quarter: 'q4', label: 'Q4' },
  ];

  return quarters.map(({ quarter, label }) => {
    let onTrack = 0;
    let slightlyOff = 0;
    let offTrack = 0;
    let notStarted = 0;

    // Get all outcomes from all WhyGOs
    const allOutcomes = whygos.flatMap((whygo) => whygo.outcomes);

    // Count statuses for this quarter
    allOutcomes.forEach((outcome) => {
      const status = outcome[`${quarter}Status`];
      if (status === '+') {
        onTrack++;
      } else if (status === '~') {
        slightlyOff++;
      } else if (status === '-') {
        offTrack++;
      } else {
        notStarted++;
      }
    });

    const total = onTrack + slightlyOff + offTrack + notStarted;

    return {
      quarter,
      quarterLabel: label,
      onTrack,
      slightlyOff,
      offTrack,
      notStarted,
      total,
    };
  });
}

/**
 * Get pending approvals filtered from WhyGOs
 */
export function getPendingApprovals(whygos: WhyGOWithOutcomes[]): WhyGOWithOutcomes[] {
  return whygos.filter((whygo) => whygo.approvedBy === null && whygo.status === 'draft');
}

/**
 * Calculate health percentage
 */
export function calculateHealthPercentage(
  health: { onTrack: number; slightlyOff: number; offTrack: number; notStarted: number }
): { onTrackPct: number; slightlyOffPct: number; offTrackPct: number; notStartedPct: number } {
  const total = health.onTrack + health.slightlyOff + health.offTrack + health.notStarted;

  if (total === 0) {
    return { onTrackPct: 0, slightlyOffPct: 0, offTrackPct: 0, notStartedPct: 0 };
  }

  return {
    onTrackPct: Math.round((health.onTrack / total) * 100),
    slightlyOffPct: Math.round((health.slightlyOff / total) * 100),
    offTrackPct: Math.round((health.offTrack / total) * 100),
    notStartedPct: Math.round((health.notStarted / total) * 100),
  };
}

/**
 * Get company-level WhyGOs only
 */
export function getCompanyWhyGOs(whygos: WhyGOWithOutcomes[]): WhyGOWithOutcomes[] {
  return whygos.filter((whygo) => whygo.level === 'company');
}

/**
 * Calculate Q1-only outcome summary for outcomes
 */
export function getQ1OutcomeSummary(outcomes: any[]) {
  return {
    onTrack: outcomes.filter((o) => o.q1Status === '+').length,
    slightlyOff: outcomes.filter((o) => o.q1Status === '~').length,
    offTrack: outcomes.filter((o) => o.q1Status === '-').length,
    notStarted: outcomes.filter((o) => o.q1Status === null).length,
    total: outcomes.length,
  };
}

/**
 * Filter quarterly breakdown to Q1 only
 */
export function getQ1Breakdown(whygos: WhyGOWithOutcomes[]): QuarterlyStats {
  const allOutcomes = whygos.flatMap((whygo) => whygo.outcomes);

  let onTrack = 0;
  let slightlyOff = 0;
  let offTrack = 0;
  let notStarted = 0;

  allOutcomes.forEach((outcome) => {
    const status = outcome.q1Status;
    if (status === '+') onTrack++;
    else if (status === '~') slightlyOff++;
    else if (status === '-') offTrack++;
    else notStarted++;
  });

  const total = onTrack + slightlyOff + offTrack + notStarted;

  return {
    quarter: 'q1',
    quarterLabel: 'Q1',
    onTrack,
    slightlyOff,
    offTrack,
    notStarted,
    total,
  };
}

/**
 * Calculate department stats with Q1 filtering
 */
export function calculateDepartmentStatsQ1(whygos: WhyGOWithOutcomes[]): DepartmentStat[] {
  const departmentMap = new Map<string, WhyGOWithOutcomes[]>();

  whygos.forEach((whygo) => {
    if (whygo.level === 'department' && whygo.department) {
      const deptWhyGOs = departmentMap.get(whygo.department) || [];
      deptWhyGOs.push(whygo);
      departmentMap.set(whygo.department, deptWhyGOs);
    }
  });

  const stats: DepartmentStat[] = [];

  departmentMap.forEach((deptWhyGOs, department) => {
    const health = {
      onTrack: 0,
      slightlyOff: 0,
      offTrack: 0,
      notStarted: 0,
    };

    // Aggregate Q1 health only
    deptWhyGOs.forEach((whygo) => {
      const q1Summary = getQ1OutcomeSummary(whygo.outcomes);
      health.onTrack += q1Summary.onTrack;
      health.slightlyOff += q1Summary.slightlyOff;
      health.offTrack += q1Summary.offTrack;
      health.notStarted += q1Summary.notStarted;
    });

    stats.push({
      name: department,
      goalCount: deptWhyGOs.length,
      health,
      whygos: deptWhyGOs,
    });
  });

  return stats.sort((a, b) => a.name.localeCompare(b.name));
}
