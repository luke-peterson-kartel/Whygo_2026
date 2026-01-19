import { Link } from 'react-router-dom';
import { LightbulbIcon, HelpCircleIcon, LayersIcon, TargetIcon, BookOpenIcon, ArrowRightIcon } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'Simple Explanation',
    description: 'Learn WhyGo through simple analogies and real examples',
    icon: LightbulbIcon,
    path: '/philosophy/step1',
    color: 'blue',
  },
  {
    number: 2,
    title: 'Confusion Check',
    description: 'Test your understanding with an interactive quiz',
    icon: HelpCircleIcon,
    path: '/philosophy/step2',
    color: 'purple',
  },
  {
    number: 3,
    title: 'Refinement Cycles',
    description: 'Dive deeper into structure, alignment, and constraints',
    icon: LayersIcon,
    path: '/philosophy/step3',
    color: 'green',
  },
  {
    number: 4,
    title: 'Understanding Challenge',
    description: 'Apply your knowledge through hands-on exercises',
    icon: TargetIcon,
    path: '/philosophy/step4',
    color: 'orange',
  },
  {
    number: 5,
    title: 'Teaching Snapshot',
    description: 'Get your complete reference guide and certification',
    icon: BookOpenIcon,
    path: '/philosophy/step5',
    color: 'pink',
  },
];

export function PhilosophyIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            WhyGo Philosophy Module
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master the WhyGo framework through a 5-step learning journey. By the end, you'll understand not just what WhyGos are, but why we use them and how to create your own.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>⏱️</span>
            <span>Estimated time: 15-20 minutes</span>
          </div>
        </div>

        {/* Learning Path */}
        <div className="space-y-4 mb-12">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
              purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
              green: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200',
              orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200',
              pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200',
            }[step.color];

            return (
              <Link
                key={step.number}
                to={step.path}
                className={`
                  block bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg
                  ${colorClasses}
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                    ${step.color === 'blue' ? 'bg-blue-500 text-white' : ''}
                    ${step.color === 'purple' ? 'bg-purple-500 text-white' : ''}
                    ${step.color === 'green' ? 'bg-green-500 text-white' : ''}
                    ${step.color === 'orange' ? 'bg-orange-500 text-white' : ''}
                    ${step.color === 'pink' ? 'bg-pink-500 text-white' : ''}
                  `}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-700">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRightIcon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* What You'll Learn */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Core Concepts</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>WHY-GOAL-OUTCOME structure explained simply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Company → Department → Individual alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Why "maximum 3" isn't a suggestion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>How WhyGos link to your compensation</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Practical Skills</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Identify weak vs strong goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Distinguish activities from outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Create measurable outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Explain WhyGos to colleagues</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/philosophy/step1"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Start Learning</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
