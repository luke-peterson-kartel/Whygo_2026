import { AnalogyCard } from './components/AnalogyCard';
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

export function Step1_SimpleExplanation() {
  const analogies = philosophyContent.step1_analogies;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Step 1 of 5
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Understanding WhyGo Through Simple Analogies
              </h1>
              <p className="text-xl text-gray-600">
                Let's start with the basics. WhyGo might sound complex, but it's actually quite simple when you think of it the right way.
              </p>
            </div>

            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Why WhyGo Exists at Kartel
              </h2>
              <p className="text-blue-800 leading-relaxed">
                Enterprise clients need 100% brand accuracy in their creative content. Generic AI tools only deliver about 70%. Kartel built Creative Intelligence Infrastructure to solve this problem - custom AI models and workflows trained exclusively on each client's brand data. WhyGo is how we make sure everyone at Kartel focuses on proving this works across multiple industries.
              </p>
            </div>

            {/* Analogy Cards */}
            <div className="space-y-6 mb-8">
              {analogies.map((analogy) => (
                <AnalogyCard
                  key={analogy.id}
                  concept={analogy.concept}
                  analogy={analogy.analogy}
                  explanation={analogy.explanation}
                  example={analogy.example}
                />
              ))}
            </div>

            {/* Key Takeaway */}
            <div className="bg-green-50 rounded-lg p-6 mb-8 border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                Key Takeaway from Step 1
              </h3>
              <p className="text-green-800 leading-relaxed">
                WhyGo is like a GPS for the company. Just like GPS needs your current location (WHY), destination (GOAL), and mile markers (OUTCOMES), every WhyGo has three components that work together to guide Kartel toward strategic success. These three pieces aren't optional - they're the system.
              </p>
            </div>

            {/* Navigation */}
            <StepNavigation
              currentStep={1}
              totalSteps={5}
              nextPath="/philosophy/step2"
              nextLabel="Continue to Confusion Check"
              canProceed={true}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProgressTracker currentStep={1} steps={STEPS} />

              {/* Quick Reference */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Quick Reference
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-blue-600">WHY</span>
                    <p className="text-gray-600 mt-1">North Star (strategic context)</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">GOAL</span>
                    <p className="text-gray-600 mt-1">Destination (what will be different)</p>
                  </div>
                  <div>
                    <span className="font-medium text-purple-600">OUTCOMES</span>
                    <p className="text-gray-600 mt-1">Mile Markers (proof of progress)</p>
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
