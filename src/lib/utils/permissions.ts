import type { Employee, EmployeeLevel } from '@/types/employee.types';
import type { WhyGO, Outcome, WhyGOLevel } from '@/types/whygo.types';

export class PermissionService {

  static canViewWhyGO(user: Employee, whygo: WhyGO): boolean {
    // Company level: everyone
    if (whygo.level === 'company') return true;

    // Department level: same department + executives
    if (whygo.level === 'department') {
      return (
        user.department === whygo.department ||
        user.level === 'executive'
      );
    }

    // Individual level: owner + direct reports + managers + executives
    if (whygo.level === 'individual') {
      return (
        whygo.ownerId === user.id ||
        this.isManager(user) ||
        user.level === 'executive'
      );
    }

    return false;
  }

  static canEditWhyGO(user: Employee, whygo: WhyGO): boolean {
    // Executives can edit anything
    if (user.level === 'executive') return true;

    // Department heads can edit their department's WhyGOs (both department and individual level)
    if (
      user.level === 'department_head' &&
      whygo.department === user.department &&
      (whygo.level === 'department' || whygo.level === 'individual')
    ) {
      return true;
    }

    // Approved WhyGOs can't be edited by owner (only managers+)
    if (whygo.approvedBy !== null && whygo.ownerId === user.id) {
      return false;
    }

    // Owner can edit their own WhyGO
    if (whygo.ownerId === user.id) {
      return true;
    }

    // Managers can edit team member WhyGOs
    if (this.isManager(user)) return true;

    return false;
  }

  static canCreateWhyGO(user: Employee, level: WhyGOLevel): boolean {
    if (level === 'company') {
      return user.level === 'executive';
    }

    if (level === 'department') {
      return user.level === 'department_head' || user.level === 'executive';
    }

    if (level === 'individual') {
      // Everyone can create their own individual WhyGOs
      return true;
    }

    return false;
  }

  static canUpdateProgress(user: Employee, outcome: Outcome): boolean {
    // Outcome owner can update
    if (outcome.ownerId === user.id) return true;

    // Managers and executives can update
    if (this.isManager(user) || user.level === 'executive') return true;

    return false;
  }

  static canEditOutcomeDetails(user: Employee): boolean {
    // Only executives and department heads can edit outcome details (description, targets, unit)
    return user.level === 'executive' || user.level === 'department_head';
  }

  static canApproveWhyGO(user: Employee, whygo: WhyGO): boolean {
    // Company level: only CEO/executives
    if (whygo.level === 'company') {
      return user.level === 'executive';
    }

    // Department level: CEO approval required
    if (whygo.level === 'department') {
      return user.level === 'executive';
    }

    // Individual level: direct manager or above
    if (whygo.level === 'individual') {
      return this.isManager(user) || user.level === 'executive';
    }

    return false;
  }

  static canDeleteWhyGO(user: Employee, whygo: WhyGO): boolean {
    // Executives can delete anything
    if (user.level === 'executive') return true;

    // Department heads can delete their department's WhyGOs (both department and individual level)
    if (
      user.level === 'department_head' &&
      whygo.department === user.department &&
      (whygo.level === 'department' || whygo.level === 'individual')
    ) {
      return true;
    }

    // Owner can delete their own WhyGO
    if (whygo.ownerId === user.id) return true;

    return false;
  }

  static canAccessManagementDashboard(user: Employee): boolean {
    return user.level === 'executive' || user.level === 'department_head';
  }

  static canViewEmployee(user: Employee, targetEmployee: Employee): boolean {
    // Everyone can view all employees
    return true;
  }

  static canEditEmployee(user: Employee, targetEmployee: Employee): boolean {
    // Only executives can edit employee records
    return user.level === 'executive';
  }

  private static isManager(user: Employee): boolean {
    return ['manager', 'department_head', 'executive'].includes(user.level);
  }

  /**
   * Check if user is in the reporting chain of another employee
   */
  static isInReportingChain(manager: Employee, employee: Employee, allEmployees: Employee[]): boolean {
    let current: Employee | undefined = employee;

    while (current && current.reportsTo) {
      if (current.reportsTo === manager.id) {
        return true;
      }

      current = allEmployees.find(e => e.id === current!.reportsTo);
    }

    return false;
  }

  /**
   * Get all direct reports for a manager
   */
  static getDirectReports(manager: Employee, allEmployees: Employee[]): Employee[] {
    return allEmployees.filter(e => e.reportsTo === manager.id);
  }

  /**
   * Get all employees in a manager's reporting chain (direct and indirect)
   */
  static getAllReports(manager: Employee, allEmployees: Employee[]): Employee[] {
    const reports: Employee[] = [];
    const directReports = this.getDirectReports(manager, allEmployees);

    for (const report of directReports) {
      reports.push(report);
      reports.push(...this.getAllReports(report, allEmployees));
    }

    return reports;
  }
}
