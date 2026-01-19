import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

interface ExecutiveSummaryProps {
  priorities: string[];
  alignment: string;
  dependencies?: string;
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'teal';
}

const colorSchemes = {
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    card: 'bg-white/60 border-orange-100',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    card: 'bg-white/60 border-green-100',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    card: 'bg-white/60 border-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    card: 'bg-white/60 border-purple-100',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'text-teal-600',
    card: 'bg-white/60 border-teal-100',
  },
};

export default function ExecutiveSummary({
  priorities,
  alignment,
  dependencies,
  color = 'blue'
}: ExecutiveSummaryProps) {
  const scheme = colorSchemes[color];

  return (
    <div className={`${scheme.bg} border ${scheme.border} rounded-lg p-8 mb-8`}>
      <div className="flex items-center space-x-3 mb-6">
        <Target className={`h-6 w-6 ${scheme.icon}`} />
        <h2 className="text-2xl font-bold text-gray-900">Strategic Priorities</h2>
      </div>

      <div className="space-y-6">
        {/* Strategic Priorities */}
        <div className={`${scheme.card} backdrop-blur-sm rounded-lg p-6 border`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">2026 Focus Areas</h3>
          <ul className="space-y-3">
            {priorities.map((priority, index) => (
              <li key={index} className="flex items-start space-x-3">
                <ArrowRight className={`h-5 w-5 ${scheme.icon} mt-0.5 flex-shrink-0`} />
                <span className="text-gray-700">{priority}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Company WhyGO Alignment */}
        <div className={`${scheme.card} backdrop-blur-sm rounded-lg p-6 border`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Company WhyGO Alignment</h3>
          <p className="text-gray-700">{alignment}</p>
        </div>

        {/* Dependencies (optional) */}
        {dependencies && (
          <div className={`${scheme.card} backdrop-blur-sm rounded-lg p-6 border`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Dependencies</h3>
            <p className="text-gray-700">{dependencies}</p>
          </div>
        )}
      </div>
    </div>
  );
}
