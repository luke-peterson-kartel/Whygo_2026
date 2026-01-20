import { Sparkles } from 'lucide-react';
import { autoDistributeQuarterlyTargets } from '@/lib/utils/validation';

interface QuarterlyTargetInputsProps {
  annualTarget: number | string;
  q1: number | string;
  q2: number | string;
  q3: number | string;
  q4: number | string;
  onQ1Change: (value: number | string) => void;
  onQ2Change: (value: number | string) => void;
  onQ3Change: (value: number | string) => void;
  onQ4Change: (value: number | string) => void;
  disabled?: boolean;
  unit?: string;
}

export function QuarterlyTargetInputs({
  annualTarget,
  q1,
  q2,
  q3,
  q4,
  onQ1Change,
  onQ2Change,
  onQ3Change,
  onQ4Change,
  disabled = false,
  unit,
}: QuarterlyTargetInputsProps) {
  const handleAutoDistribute = () => {
    const annual = typeof annualTarget === 'number' ? annualTarget : parseFloat(annualTarget.toString());
    if (isNaN(annual) || annual <= 0) return;

    const distributed = autoDistributeQuarterlyTargets(annual);
    onQ1Change(distributed.q1);
    onQ2Change(distributed.q2);
    onQ3Change(distributed.q3);
    onQ4Change(distributed.q4);
  };

  // Calculate sum and percentage of annual
  const q1Val = typeof q1 === 'number' ? q1 : parseFloat(q1.toString() || '0');
  const q2Val = typeof q2 === 'number' ? q2 : parseFloat(q2.toString() || '0');
  const q3Val = typeof q3 === 'number' ? q3 : parseFloat(q3.toString() || '0');
  const q4Val = typeof q4 === 'number' ? q4 : parseFloat(q4.toString() || '0');
  const sum = q1Val + q2Val + q3Val + q4Val;

  const annualVal = typeof annualTarget === 'number' ? annualTarget : parseFloat(annualTarget.toString() || '0');
  const percentage = annualVal > 0 ? Math.round((sum / annualVal) * 100) : 0;
  const isValid = Math.abs(sum - annualVal) <= annualVal * 0.01; // ±1% tolerance

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Quarterly Targets
          <span className="text-red-500 ml-1">*</span>
        </label>
        {annualVal > 0 && (
          <button
            type="button"
            onClick={handleAutoDistribute}
            disabled={disabled}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Auto-distribute
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label htmlFor="q1" className="block text-xs font-medium text-gray-600 mb-1">
            Q1
          </label>
          <input
            id="q1"
            type="number"
            value={q1}
            onChange={(e) => onQ1Change(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="q2" className="block text-xs font-medium text-gray-600 mb-1">
            Q2
          </label>
          <input
            id="q2"
            type="number"
            value={q2}
            onChange={(e) => onQ2Change(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="q3" className="block text-xs font-medium text-gray-600 mb-1">
            Q3
          </label>
          <input
            id="q3"
            type="number"
            value={q3}
            onChange={(e) => onQ3Change(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="q4" className="block text-xs font-medium text-gray-600 mb-1">
            Q4
          </label>
          <input
            id="q4"
            type="number"
            value={q4}
            onChange={(e) => onQ4Change(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="0"
          />
        </div>
      </div>

      {/* Sum validation */}
      {annualVal > 0 && sum > 0 && (
        <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          Sum: {sum.toLocaleString()} ({percentage}% of annual target)
          {!isValid && ' - Must equal annual target ±1%'}
        </div>
      )}
    </div>
  );
}
