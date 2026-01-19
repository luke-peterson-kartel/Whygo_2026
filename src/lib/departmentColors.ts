export const DEPARTMENT_COLORS = {
  Sales: 'from-green-600 to-emerald-700',
  Production: 'from-orange-600 to-amber-700',
  Generative: 'from-purple-600 to-violet-700',
  Platform: 'from-teal-600 to-cyan-700',
  Community: 'from-blue-600 to-indigo-700',
} as const;

export type DepartmentName = keyof typeof DEPARTMENT_COLORS;

export function getDepartmentColor(department: string): string {
  return DEPARTMENT_COLORS[department as DepartmentName] || 'from-gray-600 to-gray-700';
}
