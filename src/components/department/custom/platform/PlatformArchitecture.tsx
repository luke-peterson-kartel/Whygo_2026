import { Globe, Kanban, Sparkles, Network } from 'lucide-react';

const components = [
  {
    name: 'Client Portal',
    owner: 'Platform team',
    purpose: 'Client-facing engagement management',
    status: 'Active development',
    icon: Globe,
    color: 'teal',
  },
  {
    name: 'Production Management',
    owner: 'Platform team',
    purpose: 'Internal handoff tracking',
    status: 'Q1 MVP priority',
    icon: Kanban,
    color: 'orange',
  },
  {
    name: 'Generative Platform',
    owner: 'Generative team',
    purpose: 'AI content generation workflows',
    status: 'Active',
    icon: Sparkles,
    color: 'purple',
  },
  {
    name: 'Integration Layer',
    owner: 'Platform team',
    purpose: 'Cross-system connections',
    status: 'Foundational',
    icon: Network,
    color: 'blue',
  },
];

const colorClasses = {
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-800',
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
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
  },
};

export function PlatformArchitecture() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Platform Architecture
        </h2>
        <p className="text-gray-600">
          Four core system components powering Kartel's client delivery and internal operations
        </p>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {components.map((component) => {
          const Icon = component.icon;
          const colors = colorClasses[component.color as keyof typeof colorClasses];

          return (
            <div
              key={component.name}
              className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
                  {component.status}
                </div>
                <Icon className={`h-8 w-8 ${colors.icon}`} />
              </div>

              {/* Component Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {component.name}
              </h3>

              {/* Purpose */}
              <p className="text-sm text-gray-700 mb-4">
                {component.purpose}
              </p>

              {/* Owner */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Owner
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {component.owner}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Context */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          The Integration Layer Philosophy
        </h3>
        <p className="text-sm text-gray-700 mb-2">
          Platform isn't just infrastructure — it's the connective tissue that enables Kartel's 70% client delivery model:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-teal-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Client Portal:</strong> Transparent engagement visibility without constant communication overhead</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Production Management:</strong> Handoff discipline can't scale without tooling (Q1 MVP critical)</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Generative Platform:</strong> AI workflows + QC frameworks enable rapid content delivery</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Integration Layer:</strong> Connects all systems, ensuring data flows seamlessly across departments</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
