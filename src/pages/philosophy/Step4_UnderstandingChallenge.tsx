import { ProgressTracker } from './components/ProgressTracker';
import { StepNavigation } from './components/StepNavigation';

const STEPS = [
  { title: 'Simple Explanation' },
  { title: 'Confusion Check' },
  { title: 'Refinement Cycles' },
  { title: 'Understanding Challenge' },
  { title: 'Teaching Snapshot' },
];

export function Step4_UnderstandingChallenge() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Step 4 of 5
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Understanding Challenge: Apply Your Knowledge
              </h1>
              <p className="text-xl text-gray-600">
                Now it's time to apply what you've learned through interactive exercises.
              </p>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Interactive Exercises Coming Soon
              </h2>
              <p className="text-blue-800 leading-relaxed">
                This step will include hands-on challenges where you'll fix weak goals, match department goals to company WhyGos, and build quarterly pacing. For now, you can continue to the final step to see your teaching snapshot.
              </p>
            </div>

            {/* Preview of Challenges */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preview: What You'll Practice</h3>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge 1: Fix Weak Goals</h4>
                  <p className="text-gray-700 mb-2">
                    <span className="text-red-600">Weak:</span> "Improve our sales process"
                  </p>
                  <p className="text-gray-700">
                    <span className="text-green-600">Strong:</span> "Onboard 10 enterprise clients across 5 verticals by Q2 2026"
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge 2: Match Alignments</h4>
                  <p className="text-gray-700">
                    Match department goals to the company WhyGos they support
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge 3: Build Quarterly Pacing</h4>
                  <p className="text-gray-700">
                    Create realistic Q1→Q2→Q3→Q4 targets for a 16-client annual goal
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <StepNavigation
              currentStep={4}
              totalSteps={5}
              prevPath="/philosophy/step3"
              nextPath="/philosophy/step5"
              nextLabel="Continue to Teaching Snapshot"
              canProceed={true}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProgressTracker currentStep={4} steps={STEPS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
