import { Users, KeyRound, Unlock } from 'lucide-react';

const journeyStages = [
  {
    tiers: 'Tier 1-2',
    status: 'Community Member',
    access: 'Discord identity',
    gatekeeper: 'Community team',
    icon: Users,
    color: 'blue',
  },
  {
    tiers: 'Tier 3-4',
    status: 'Skill Verified / Trial Contributor',
    access: 'SSO access granted',
    gatekeeper: 'Daniel (Community) → Fill (Generative)',
    icon: KeyRound,
    color: 'purple',
  },
  {
    tiers: 'Tier 5',
    status: 'Approved Kartel Talent',
    access: 'Production platform access',
    gatekeeper: 'Fill (Generative)',
    icon: Unlock,
    color: 'green',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
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

export function TalentEngineJourney() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Talent Engine User Journey
        </h2>
        <p className="text-gray-600">
          Three-stage platform access progression tied to the 5-tier talent pipeline
        </p>
      </div>

      {/* Journey Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {journeyStages.map((stage) => {
          const Icon = stage.icon;
          const colors = colorClasses[stage.color as keyof typeof colorClasses];

          return (
            <div
              key={stage.tiers}
              className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-sm`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
                  {stage.tiers}
                </div>
                <Icon className={`h-8 w-8 ${colors.icon}`} />
              </div>

              {/* Status */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {stage.status}
              </h3>

              {/* Platform Access */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Platform Access
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {stage.access}
                </p>
              </div>

              {/* Gatekeeper */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Gatekeeper
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {stage.gatekeeper}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SSO Context Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          SSO as a Platform Gate
        </h3>
        <p className="text-sm text-gray-700">
          Single Sign-On (SSO) access is the critical platform gate that unlocks progression:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Tiers 1-2:</strong> Discord-only access keeps early community members engaged without platform risk</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Tiers 3-4:</strong> SSO granted after skill verification, enabling supervised project work with limited access</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Tier 5:</strong> Full production platform access granted only after proven client delivery capability</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
