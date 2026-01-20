import { useEmployees } from '@/hooks/useEmployees';

interface EmployeeSelectorProps {
  value: string;
  onChange: (employeeId: string, employeeName: string) => void;
  disabled?: boolean;
}

export function EmployeeSelector({ value, onChange, disabled = false }: EmployeeSelectorProps) {
  const { employees, loading } = useEmployees();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find((emp) => emp.id === selectedId);
    if (selectedEmployee) {
      onChange(selectedEmployee.id, selectedEmployee.name);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled || loading}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">Select owner</option>
      {employees.map((employee) => (
        <option key={employee.id} value={employee.id}>
          {employee.name} ({employee.title})
        </option>
      ))}
    </select>
  );
}
