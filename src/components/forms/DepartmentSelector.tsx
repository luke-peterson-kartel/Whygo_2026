interface DepartmentSelectorProps {
  value: string | null;
  onChange: (department: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

const DEPARTMENTS = [
  'Sales',
  'Marketing',
  'Production',
  'Customer Success',
  'Finance',
  'Operations',
];

export function DepartmentSelector({
  value,
  onChange,
  disabled = false,
  required = false,
}: DepartmentSelectorProps) {
  return (
    <div>
      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
        Department
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id="department"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Select a department</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
}
