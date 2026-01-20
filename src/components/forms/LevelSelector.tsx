interface LevelSelectorProps {
  value: 'company' | 'department' | 'individual';
  onChange: (level: 'company' | 'department' | 'individual') => void;
  disabled?: boolean;
}

export function LevelSelector({ value, onChange, disabled = false }: LevelSelectorProps) {
  const levels = [
    { value: 'company' as const, label: 'Company', description: 'Organization-wide strategic goals' },
    { value: 'department' as const, label: 'Department', description: 'Department-specific goals' },
    { value: 'individual' as const, label: 'Individual', description: 'Personal performance goals' },
  ];

  return (
    <div className="space-y-3">
      {levels.map((level) => (
        <label
          key={level.value}
          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
            value === level.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="level"
            value={level.value}
            checked={value === level.value}
            onChange={(e) => onChange(e.target.value as any)}
            disabled={disabled}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <div className="font-semibold text-gray-900">{level.label}</div>
            <div className="text-sm text-gray-600">{level.description}</div>
          </div>
        </label>
      ))}
    </div>
  );
}
