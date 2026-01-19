import React from 'react';
import { ArrowRight, Users, BookOpen, BadgeCheck, Briefcase, Award } from 'lucide-react';

const tiers = [
  {
    tier: 1,
    title: 'Community Member',
    description: 'Joined Discord + completed onboarding',
    icon: Users,
    access: 'Discord only',
    color: 'gray',
  },
  {
    tier: 2,
    title: 'Engaged Learner',
    description: 'Active in training programs',
    icon: BookOpen,
    access: 'Discord + learning materials',
    color: 'blue',
  },
  {
    tier: 3,
    title: 'Skill Verified',
    description: 'Passed assessment in role track',
    icon: BadgeCheck,
    access: 'Discord + SSO (limited)',
    color: 'indigo',
  },
  {
    tier: 4,
    title: 'Trial Contributor',
    description: 'Completed supervised project',
    icon: Briefcase,
    access: 'Discord + SSO (extended)',
    color: 'purple',
  },
  {
    tier: 5,
    title: 'Approved Kartel Talent',
    description: 'Deployed on client work',
    icon: Award,
    access: 'Full production platform',
    color: 'green',
  },
];

const roleTracks = [
  'Workflow Engineer',
  'AI Generalist',
  'Data Specialist',
  'Training Specialist',
  'Preditor',
];

const colorClasses = {
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    icon: 'text-gray-600',
    badge: 'bg-gray-100 text-gray-800',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-800',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
  },
};

export function FiveTierPipeline() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          5-Tier Talent Pipeline
        </h2>
        <p className="text-gray-600">
          Progressive skill development and platform access system from community member to deployed talent
        </p>
      </div>

      {/* Scroll hint for mobile */}
      <div className="mb-4 text-sm text-gray-500 text-center md:hidden">
        ← Scroll horizontally to view all tiers →
      </div>

      {/* Tier Cards - Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-6">
        <div className="flex items-start gap-4 min-w-max pb-4">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const colors = colorClasses[tier.color as keyof typeof colorClasses];

            return (
              <React.Fragment key={tier.tier}>
                <div className={`w-72 flex-shrink-0 ${colors.bg} border-2 ${colors.border} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${colors.badge} px-3 py-1 rounded-full text-sm font-bold`}>
                      Tier {tier.tier}
                    </div>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {tier.description}
                  </p>

                  {/* Platform Access */}
                  <div className="bg-white/50 border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Platform Access
                    </h4>
                    <p className="text-sm font-semibold text-gray-900">
                      {tier.access}
                    </p>
                  </div>
                </div>

                {/* Arrow between cards (not after last one) */}
                {index < tiers.length - 1 && (
                  <div className="flex items-center justify-center flex-shrink-0 pt-8">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Role Tracks */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Role Tracks
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Community members can specialize in one of five role tracks as they progress through the tiers:
        </p>
        <div className="flex flex-wrap gap-2">
          {roleTracks.map((role) => (
            <div
              key={role}
              className="bg-blue-100 border border-blue-300 rounded-full px-4 py-2 text-sm font-semibold text-blue-900"
            >
              {role}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
