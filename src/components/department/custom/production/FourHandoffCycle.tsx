import React from 'react';
import { ArrowRight, Users, Package, Sparkles, FileText } from 'lucide-react';

const handoffs = [
  {
    number: 1,
    title: 'Sales → Production',
    parties: 'Sales closes, Production scopes',
    icon: Users,
    deliverables: [
      'SOW signed',
      'Scoped in platform',
      'Milestones defined',
      'Timeline established',
      'Staffing plan',
      'Budget allocated',
    ],
    color: 'green',
  },
  {
    number: 2,
    title: 'Production → Generative',
    parties: 'Production requests pod resources',
    icon: Package,
    deliverables: [
      'Pod request with specs',
      'Pod roles assigned',
      'Timeline confirmed',
      'Deliverable specs',
      'Brand context',
    ],
    color: 'orange',
  },
  {
    number: 3,
    title: 'Generative → Production',
    parties: 'Generative delivers to Production',
    icon: Sparkles,
    deliverables: [
      'QC-passed deliverables',
      'Assets submitted in platform',
      'Quality review complete',
    ],
    color: 'purple',
  },
  {
    number: 4,
    title: 'Production → Sales',
    parties: 'Production delivers Closing Report',
    icon: FileText,
    deliverables: [
      'Closing Report delivered',
      'Margin data provided',
      'Case study visuals',
      'Use cases for Sales',
    ],
    color: 'green',
  },
];

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-800',
  },
};

export function FourHandoffCycle() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          The Four Handoff Cycle
        </h2>
        <p className="text-gray-600">
          Platform-tracked handoff systems that scale from 6 to 20 active client engagements
        </p>
      </div>

      {/* Scroll hint for mobile */}
      <div className="mb-4 text-sm text-gray-500 text-center md:hidden">
        ← Scroll horizontally to view all handoffs →
      </div>

      {/* Handoff Cards - Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-6">
        <div className="flex items-start gap-4 min-w-max pb-4">
        {handoffs.map((handoff, index) => {
          const Icon = handoff.icon;
          const colors = colorClasses[handoff.color as keyof typeof colorClasses];

          return (
            <React.Fragment key={handoff.number}>
              <div className={`w-72 flex-shrink-0 ${colors.bg} border-2 ${colors.border} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`${colors.badge} px-3 py-1 rounded-full text-sm font-bold`}>
                    Handoff #{handoff.number}
                  </div>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {handoff.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {handoff.parties}
                </p>

                {/* Deliverables */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Deliverables
                  </h4>
                  <ul className="space-y-1.5">
                    {handoff.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                        <span className="text-sm text-gray-700">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Arrow between cards (not after last one) */}
              {index < handoffs.length - 1 && (
                <div className="flex items-center justify-center flex-shrink-0 pt-8">
                  <ArrowRight className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          );
        })}
        </div> {/* Close flex container */}
      </div> {/* Close scroll container */}

      {/* Completion Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>After Handoff #4:</strong> Sales collects NPS from client, re-engages for expansion, and closes the feedback loop.
        </p>
      </div>

      {/* Platform Dependency Note */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Platform Dependency:</strong> Production Management MVP must be fully in use by Q1. Handoff discipline cannot be enforced without tooling.
        </p>
      </div>
    </div>
  );
}
