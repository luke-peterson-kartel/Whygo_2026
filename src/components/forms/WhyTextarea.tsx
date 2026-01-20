import { useState, useEffect } from 'react';

interface WhyTextareaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minLength?: number;
  error?: string;
}

export function WhyTextarea({
  value,
  onChange,
  disabled = false,
  minLength = 100,
  error,
}: WhyTextareaProps) {
  const [charCount, setCharCount] = useState(value.length);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const isValid = charCount >= minLength;

  return (
    <div>
      <label htmlFor="why" className="block text-sm font-medium text-gray-700 mb-2">
        WHY Statement
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative">
        <textarea
          id="why"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-300'
          }`}
          placeholder="Explain the purpose and importance of this goal. Why does it matter? What impact will it have? (Minimum 100 characters)"
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-500">
          {charCount} / {minLength}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!error && charCount > 0 && charCount < minLength && (
        <p className="mt-1 text-sm text-yellow-600">
          {minLength - charCount} more characters required
        </p>
      )}
    </div>
  );
}
