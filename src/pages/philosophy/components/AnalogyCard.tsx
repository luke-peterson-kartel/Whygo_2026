import { LightbulbIcon } from 'lucide-react';

interface AnalogyCardProps {
  concept: string;
  analogy: string;
  explanation: string;
  example?: {
    why?: string;
    goal?: string;
    outcomes?: string;
  } | string;
}

export function AnalogyCard({ concept, analogy, explanation, example }: AnalogyCardProps) {
  const isStructuredExample = typeof example === 'object' && example !== null;

  return (
    <div className="bg-white rounded-lg border-2 border-blue-100 p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <LightbulbIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{concept}</h3>
          <p className="text-sm text-gray-500 mt-1 italic">"{analogy}"</p>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {explanation}
      </p>

      {/* Example (if provided) */}
      {example && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            Example
          </p>
          {isStructuredExample ? (
            <div className="space-y-2">
              {example.why && (
                <div>
                  <span className="text-xs font-medium text-blue-600">WHY:</span>
                  <p className="text-sm text-gray-700 mt-1">{example.why}</p>
                </div>
              )}
              {example.goal && (
                <div>
                  <span className="text-xs font-medium text-green-600">GOAL:</span>
                  <p className="text-sm text-gray-700 mt-1">{example.goal}</p>
                </div>
              )}
              {example.outcomes && (
                <div>
                  <span className="text-xs font-medium text-purple-600">OUTCOMES:</span>
                  <p className="text-sm text-gray-700 mt-1">{example.outcomes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-700">{example}</p>
          )}
        </div>
      )}
    </div>
  );
}
