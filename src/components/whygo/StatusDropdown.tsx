import type { StatusIndicator } from '@/types/whygo.types';

interface StatusDropdownProps {
  value: StatusIndicator;
  onChange: (status: StatusIndicator) => void;
  disabled?: boolean;
}

export function StatusDropdown({ value, onChange, disabled }: StatusDropdownProps) {
  const statusOptions: Array<{ value: StatusIndicator; label: string; color: string }> = [
    { value: '+', label: 'On Track [+]', color: 'green' },
    { value: '~', label: 'At Risk [~]', color: 'yellow' },
    { value: '-', label: 'Off Track [-]', color: 'red' },
    { value: null, label: 'Not Started', color: 'gray' },
  ];

  return (
    <select
      value={value || ''}
      onChange={(e) => {
        const newValue = e.target.value;
        onChange(newValue === '' ? null : newValue as StatusIndicator);
      }}
      disabled={disabled}
      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {statusOptions.map(option => (
        <option key={option.value || 'null'} value={option.value || ''}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
