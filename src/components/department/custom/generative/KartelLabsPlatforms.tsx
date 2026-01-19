import { Building2, Users, Flask } from 'lucide-react';

const platforms = [
  {
    name: 'Internal Enterprise Platform',
    priority: 'Critical',
    purpose: 'Client delivery infrastructure',
    status: 'Active development',
    icon: Building2,
    color: 'red',
  },
  {
    name: 'Community Ecosystem Platform',
    priority: 'Critical',
    purpose: 'Discord + talent pipeline tools',
    status: 'Active development',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'Kartel Labs',
    priority: 'Active',
    purpose: 'Experimental vibe-coded projects',
    status: 'Ongoing exploration',
    icon: Flask,
    color: 'purple',
  },
];

const colorClasses = {
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
  },
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
};

export function KartelLabsPlatforms() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          2026 Platform Priorities
        </h2>
        <p className="text-gray-600">
          Three-pillar platform focus for Generative team contributions
        </p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const colors = colorClasses[platform.color as keyof typeof colorClasses];

          return (
            <div
              key={platform.name}
              className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-sm`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
                  {platform.priority}
                </div>
                <Icon className={`h-8 w-8 ${colors.icon}`} />
              </div>

              {/* Platform Name */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {platform.name}
              </h3>

              {/* Purpose */}
              <p className="text-sm text-gray-700 mb-4">
                {platform.purpose}
              </p>

              {/* Status */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {platform.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kartel Labs Contribution Model */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Kartel Labs Contribution Model
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Beyond client work, Generative team members build vibe-coded experimental projects that:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Explore new capabilities:</strong> Test emerging AI models, techniques, and workflows before client deployment</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Demonstrate thought leadership:</strong> Public-facing projects showcase Kartel's technical edge</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Feed R&D pipeline:</strong> Successful experiments graduate to production QC frameworks</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Attract talent:</strong> Community members see cutting-edge work and want to contribute</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
