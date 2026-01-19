import { ProgressTracker } from './components/ProgressTracker';
import { CheckCircle2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import philosophyContent from '@/data/philosophyContent.json';

const STEPS = [
  { title: 'Simple Explanation' },
  { title: 'Confusion Check' },
  { title: 'Refinement Cycles' },
  { title: 'Understanding Challenge' },
  { title: 'Teaching Snapshot' },
];

export function Step5_TeachingSnapshot() {
  const summary = philosophyContent.step5_summary;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                Step 5 of 5 - Final Step!
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Teaching Snapshot: Your Complete Reference
              </h1>
              <p className="text-xl text-gray-600">
                Congratulations! Here's everything you need to know about WhyGos in one place.
              </p>
            </div>

            {/* Core Concept */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-8 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{summary.title}</h2>
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                {summary.core_concept}
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
                  Why It Exists
                </p>
                <p className="text-gray-800">{summary.why_it_exists}</p>
              </div>
            </div>

            {/* Three Components */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">The Three Components</h3>
              <div className="space-y-6">
                {Object.entries(summary.three_components).map(([key, component]: [string, any]) => (
                  <div key={key} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-bold uppercase text-xs">
                        {key}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{component.what}</h4>
                      <p className="text-sm text-gray-700 mb-2">{component.purpose}</p>
                      <p className="text-sm text-blue-600 italic">"{component.analogy}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Rules */}
            <div className="bg-white rounded-lg border-2 border-purple-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Rules to Remember</h3>
              <ul className="space-y-3">
                {summary.key_rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2Icon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Tracking */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Status Tracking</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(summary.status_tracking).map(([key, status]: [string, any]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold mb-2">{status.symbol}</div>
                    <div className="text-xs font-semibold text-gray-700 uppercase mb-1">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">{status.meaning}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why It Matters to You */}
            <div className="bg-green-50 rounded-lg border-2 border-green-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-green-900 mb-4">Why This Matters to You</h3>
              <ul className="space-y-3">
                {summary.why_it_matters_to_you.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-green-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50 rounded-lg border-2 border-red-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-red-900 mb-4">Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {summary.common_mistakes_to_avoid.map((mistake: string, index: number) => (
                  <li key={index} className="text-sm text-red-800">{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Completion */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-white text-center mb-8">
              <CheckCircle2Icon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">You're Ready!</h3>
              <p className="text-lg mb-6 opacity-90">
                You've completed the WhyGo Philosophy Module. You now understand the framework and are ready to create your own WhyGos.
              </p>
              <Link
                to="/"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProgressTracker currentStep={5} steps={STEPS} />

              {/* Completion Badge */}
              <div className="mt-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-6 text-white text-center">
                <CheckCircle2Icon className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Module Complete!</h3>
                <p className="text-sm opacity-90">
                  You've mastered the WhyGo framework
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
