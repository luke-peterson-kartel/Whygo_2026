import { ProgressTracker } from './components/ProgressTracker';
import { StepNavigation } from './components/StepNavigation';
import philosophyContent from '@/data/philosophyContent.json';

const STEPS = [
  { title: 'Simple Explanation' },
  { title: 'Confusion Check' },
  { title: 'Refinement Cycles' },
  { title: 'Understanding Challenge' },
  { title: 'Teaching Snapshot' },
];

export function Step3_RefinementCycles() {
  const cycles = philosophyContent.step3_refinement_cycles;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Step 3 of 5
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Deeper Understanding: Three Refinement Cycles
              </h1>
              <p className="text-xl text-gray-600">
                Now that you understand the basics, let's dive deeper into how WhyGo actually works in practice.
              </p>
            </div>

            {/* Cycle 1: Basic Structure */}
            <div className="bg-white rounded-lg border-2 border-blue-200 p-8 mb-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                  CYCLE 1
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {cycles.cycle1.title}
                </h2>
                <p className="text-gray-600">{cycles.cycle1.summary}</p>
              </div>

              <div className="space-y-6">
                {cycles.cycle1.content.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.component}
                    </h3>
                    <p className="text-gray-700 mb-3">{item.definition}</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Rules:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.rules.map((rule: string, rIndex: number) => (
                          <li key={rIndex} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                        Real Kartel Example
                      </p>
                      <p className="text-sm text-gray-800 italic">"{item.realExample}"</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-800 mb-1">Key Insight:</p>
                <p className="text-sm text-green-700">{cycles.cycle1.keyInsight}</p>
              </div>
            </div>

            {/* Cycle 2: Strategic Alignment */}
            <div className="bg-white rounded-lg border-2 border-green-200 p-8 mb-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
                  CYCLE 2
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {cycles.cycle2.title}
                </h2>
                <p className="text-gray-600">{cycles.cycle2.summary}</p>
              </div>

              <div className="space-y-6">
                {cycles.cycle2.content.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.level}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Owner
                        </p>
                        <p className="text-sm text-gray-800 mt-1">{item.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Count
                        </p>
                        <p className="text-sm text-gray-800 mt-1">{item.count}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{item.purpose}</p>

                    {item.mustLadder && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">Must Ladder:</p>
                        <p className="text-sm text-yellow-900">{item.mustLadder}</p>
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Kartel Example:</p>
                      <p className="text-sm text-gray-800 italic">{item.kartelExample}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-2">Visualization:</p>
                <p className="text-sm text-gray-800 font-mono bg-white p-4 rounded border border-blue-200">
                  {cycles.cycle2.visualization}
                </p>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-800 mb-1">Key Insight:</p>
                <p className="text-sm text-green-700">{cycles.cycle2.keyInsight}</p>
              </div>
            </div>

            {/* Cycle 3: Why Constraints Matter */}
            <div className="bg-white rounded-lg border-2 border-purple-200 p-8 mb-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
                  CYCLE 3
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {cycles.cycle3.title}
                </h2>
                <p className="text-gray-600">{cycles.cycle3.summary}</p>
              </div>

              <div className="space-y-6">
                {cycles.cycle3.content.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      {item.constraint}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-700 uppercase mb-1">Problem</p>
                        <p className="text-sm text-red-800">{item.problem}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-700 uppercase mb-1">
                          Solution
                        </p>
                        <p className="text-sm text-green-800">{item.solution}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Purpose</p>
                        <p className="text-sm text-blue-800">{item.purpose}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-purple-700 mb-2">Real World Example:</p>
                      <p className="text-sm text-gray-800 italic">{item.realWorld}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-800 mb-1">Key Insight:</p>
                <p className="text-sm text-green-700">{cycles.cycle3.keyInsight}</p>
              </div>
            </div>

            {/* Navigation */}
            <StepNavigation
              currentStep={3}
              totalSteps={5}
              prevPath="/philosophy/step2"
              nextPath="/philosophy/step4"
              nextLabel="Continue to Understanding Challenge"
              canProceed={true}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProgressTracker currentStep={3} steps={STEPS} />

              {/* Three Cycles Summary */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Three Refinement Cycles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Basic Structure</p>
                      <p className="text-xs text-gray-600">WHY-GOAL-OUTCOME explained</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Strategic Alignment</p>
                      <p className="text-xs text-gray-600">How laddering creates coordination</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Why Constraints Matter</p>
                      <p className="text-xs text-gray-600">Focus through limitation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
