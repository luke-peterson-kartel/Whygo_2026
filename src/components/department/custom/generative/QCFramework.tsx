import { CheckCircle2, Gauge, ImageIcon, Target } from 'lucide-react';

const frameworkSteps = [
  {
    step: 1,
    title: 'Bulk Run Success',
    description: 'Define what constitutes a successful bulk generation run',
    icon: CheckCircle2,
    criteria: [
      'Output quality metrics',
      'Consistency thresholds',
      'Error rate limits',
    ],
    color: 'purple',
  },
  {
    step: 2,
    title: 'LoRA Eval',
    description: 'Model fine-tuning evaluation process',
    icon: Gauge,
    criteria: [
      'Training accuracy',
      'Validation benchmarks',
      'Style adherence',
    ],
    color: 'blue',
  },
  {
    step: 3,
    title: 'Visual Standard Sample',
    description: 'Reference samples for quality comparison',
    icon: ImageIcon,
    criteria: [
      'Style guide compliance',
      'Client approval',
      'Versioning system',
    ],
    color: 'amber',
  },
  {
    step: 4,
    title: 'Target Setting',
    description: 'Quarterly quality target establishment',
    icon: Target,
    criteria: [
      'Baseline metrics captured',
      'Improvement goals defined',
      'Review cadence set',
    ],
    color: 'green',
  },
];

const colorClasses = {
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
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
  },
};

export function QCFramework() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          QC Measurement Framework
        </h2>
        <p className="text-gray-600">
          Four-part quality control process for AI-generated content validation
        </p>
      </div>

      {/* Framework Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworkSteps.map((step) => {
          const Icon = step.icon;
          const colors = colorClasses[step.color as keyof typeof colorClasses];

          return (
            <div
              key={step.step}
              className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-sm`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.badge} px-3 py-1 rounded-full text-sm font-bold`}>
                  Step {step.step}
                </div>
                <Icon className={`h-7 w-7 ${colors.icon}`} />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {step.description}
              </p>

              {/* Criteria Checklist */}
              <div className="bg-white/50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Key Criteria
                </h4>
                <ul className="space-y-2">
                  {step.criteria.map((criterion, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 flex-shrink-0">✓</span>
                      <span className="text-sm text-gray-700">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* QC Process Note */}
      <div className="mt-6 bg-violet-50 border border-violet-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Systematic R&D Process
        </h3>
        <p className="text-sm text-gray-700">
          The QC framework integrates with ongoing R&D workflows to ensure continuous quality improvement:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-violet-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span>Every pod member receives systematic R&D exploration assignments to test new techniques</span>
          </li>
          <li className="flex items-start">
            <span className="text-violet-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span>QC measurements inform which R&D discoveries graduate to production workflows</span>
          </li>
          <li className="flex items-start">
            <span className="text-violet-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span>Baseline metrics + improvement targets ensure quarterly quality progression</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
