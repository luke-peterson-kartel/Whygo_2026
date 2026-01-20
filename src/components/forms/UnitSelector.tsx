interface UnitSelectorProps {
  value: string;
  onChange: (unit: string) => void;
  disabled?: boolean;
}

const UNITS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'count', label: 'Count (#)' },
  { value: 'text', label: 'Text (qualitative)' },
];

export function UnitSelector({ value, onChange, disabled = false }: UnitSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">Select unit</option>
      {UNITS.map((unit) => (
        <option key={unit.value} value={unit.value}>
          {unit.label}
        </option>
      ))}
    </select>
  );
}
