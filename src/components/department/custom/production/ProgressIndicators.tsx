import React from 'react';
import { TrendingUp, Activity, TrendingDown, Calendar } from 'lucide-react';

const indicators = [
  {
    symbol: '[+]',
    meaning: 'On pace',
    description: 'On pace to achieve 100% of goal',
    color: 'green',
    icon: TrendingUp,
  },
  {
    symbol: '[~]',
    meaning: 'Slightly off-pace',
    description: 'Slightly off-pace, within 20%',
    color: 'yellow',
    icon: Activity,
  },
  {
    symbol: '[-]',
    meaning: 'Off-pace',
    description: 'Off-pace, more than 20% behind',
    color: 'red',
    icon: TrendingDown,
  },
];

const reviewCadence = [
  {
    cadence: 'Weekly',
    activity: 'Leadership sync: pacing check on all WhyGOs, identify blockers',
  },
  {
    cadence: 'Monthly',
    activity: 'Full dashboard review with actuals vs. quarterly targets',
  },
  {
    cadence: 'Quarterly',
    activity: 'Board review, outcome recalibration if needed, compensation linkage review',
  },
];

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
  },
};

export default function ProgressIndicators() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Progress Tracking
      </h2>

      {/* Progress Indicators Legend */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {indicators.map((indicator) => {
            const Icon = indicator.icon;
            const colors = colorClasses[indicator.color as keyof typeof colorClasses];

            return (
              <div
                key={indicator.symbol}
                className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                  <span className="text-lg font-bold text-gray-900">
                    {indicator.symbol}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {indicator.meaning}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{indicator.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Cadence */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Cadence</h3>
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cadence
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviewCadence.map((review, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {review.cadence}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{review.activity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Through-Line */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">The Through-Line</h3>
        <p className="text-xl font-bold">
          Make Kartel operationally inevitable, not hero-dependent.
        </p>
      </div>
    </div>
  );
}
