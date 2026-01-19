import React from 'react';
import { ArrowRight, Briefcase, FileCheck, Scale, Rocket } from 'lucide-react';

const stages = [
  {
    stage: 1,
    title: 'Intro → Signed Spec',
    duration: '45 days',
    description: 'Initial engagement and specification development',
    icon: Briefcase,
    deliverables: [
      'First contact',
      'Discovery call',
      'Spec document drafted',
      'SOW signed',
    ],
    color: 'green',
  },
  {
    stage: 2,
    title: 'Spec Period',
    duration: '2 months',
    description: 'Detailed scoping and planning phase',
    icon: FileCheck,
    deliverables: [
      'Requirements gathered',
      'Technical architecture defined',
      'Timeline confirmed',
      'Budget finalized',
    ],
    color: 'blue',
  },
  {
    stage: 3,
    title: 'Decision Point',
    duration: 'Month 3',
    description: 'Client commitment decision',
    icon: Scale,
    deliverables: [
      'Final proposal review',
      'Stakeholder alignment',
      'Contract negotiation',
      'Go/No-go decision',
    ],
    color: 'amber',
  },
  {
    stage: 4,
    title: 'Full Engagement',
    duration: '10 months',
    description: 'Production delivery and ongoing support',
    icon: Rocket,
    deliverables: [
      'Project kickoff',
      'Iterative delivery',
      'Client handoffs',
      'NPS collection',
    ],
    color: 'purple',
  },
];

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-800',
  },
};

export function DealStructureTimeline() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sales Engagement Lifecycle
        </h2>
        <p className="text-gray-600">
          Four-stage client engagement process from initial contact to full production delivery
        </p>
      </div>

      {/* Scroll hint for mobile */}
      <div className="mb-4 text-sm text-gray-500 text-center md:hidden">
        ← Scroll horizontally to view all stages →
      </div>

      {/* Stage Cards - Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-6">
        <div className="flex items-start gap-4 min-w-max pb-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const colors = colorClasses[stage.color as keyof typeof colorClasses];

            return (
              <React.Fragment key={stage.stage}>
                <div className={`w-72 flex-shrink-0 ${colors.bg} border-2 ${colors.border} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${colors.badge} px-3 py-1 rounded-full text-sm font-bold`}>
                      Stage {stage.stage}
                    </div>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>

                  {/* Title & Duration */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {stage.duration}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {stage.description}
                  </p>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Key Deliverables
                    </h4>
                    <ul className="space-y-1.5">
                      {stage.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          <span className="text-sm text-gray-700">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow between cards (not after last one) */}
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center flex-shrink-0 pt-8">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Timeline Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm text-emerald-900">
          <strong>Total Timeline:</strong> From first contact to full engagement deployment averages 13 months (45 days + 2 months + 1 month + 10 months). NPS collection occurs after Stage 4 to close the feedback loop.
        </p>
      </div>
    </div>
  );
}
