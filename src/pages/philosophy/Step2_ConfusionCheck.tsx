import { useState, useEffect } from 'react';
import { QuizQuestion } from './components/QuizQuestion';
import { ProgressTracker } from './components/ProgressTracker';
import { StepNavigation } from './components/StepNavigation';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
import philosophyContent from '@/data/philosophyContent.json';

const STEPS = [
  { title: 'Simple Explanation' },
  { title: 'Confusion Check' },
  { title: 'Refinement Cycles' },
  { title: 'Understanding Challenge' },
  { title: 'Teaching Snapshot' },
];

const PASSING_SCORE = 3; // Need 3/5 correct to pass

export function Step2_ConfusionCheck() {
  const questions = philosophyContent.step2_misconceptions;
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [passed, setPassed] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    setAnsweredCount((prev) => prev + 1);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (answeredCount === questions.length && score >= PASSING_SCORE) {
      setPassed(true);
    }
  }, [answeredCount, score, questions.length]);

  const allAnswered = answeredCount === questions.length;
  const scorePercentage = questions.length > 0 ? (score / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Step 2 of 5
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Confusion Check: Common Misconceptions
              </h1>
              <p className="text-xl text-gray-600">
                Let's identify and clear up the most common misunderstandings about WhyGos.
              </p>
            </div>

            {/* Score Banner (shows after all answered) */}
            {allAnswered && (
              <div
                className={`
                  rounded-lg p-6 mb-8 border-2
                  ${passed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}
                `}
              >
                <div className="flex items-start gap-3">
                  {passed ? (
                    <CheckCircle2Icon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        passed ? 'text-green-900' : 'text-yellow-900'
                      }`}
                    >
                      {passed ? 'Great job!' : 'Review and try again'}
                    </h3>
                    <p
                      className={`text-sm ${
                        passed ? 'text-green-800' : 'text-yellow-800'
                      }`}
                    >
                      You scored {score} out of {questions.length} (
                      {Math.round(scorePercentage)}%).{' '}
                      {passed
                        ? "You've got a solid grasp of the basics. Ready to dive deeper!"
                        : 'Take a moment to review the explanations above, then you can continue to the next step.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Questions */}
            <div className="space-y-6 mb-8">
              {questions.map((q, index) => (
                <QuizQuestion
                  key={q.id}
                  question={`${index + 1}. ${q.question}`}
                  options={q.options}
                  correctIndex={q.correct}
                  explanation={q.explanation}
                  onAnswer={handleAnswer}
                />
              ))}
            </div>

            {/* Common Mistakes Summary */}
            {allAnswered && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Remember These Key Points
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      <strong>Outcomes, not activities:</strong> Focus on "what changes" not "what you do"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      <strong>Maximum 3 WhyGos:</strong> The constraint forces prioritization - that's the whole point
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      <strong>Measurable only:</strong> If you can't count it, it's not an outcome
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>
                      <strong>Must ladder up:</strong> Every goal connects to higher-level priorities
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* Navigation */}
            <StepNavigation
              currentStep={2}
              totalSteps={5}
              prevPath="/philosophy/step1"
              nextPath="/philosophy/step3"
              nextLabel="Continue to Refinement Cycles"
              canProceed={allAnswered}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProgressTracker currentStep={2} steps={STEPS} />

              {/* Score Card */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Your Score
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {score}
                    <span className="text-2xl text-gray-500">/{questions.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {answeredCount < questions.length
                      ? `${questions.length - answeredCount} questions remaining`
                      : 'Quiz complete!'}
                  </p>
                </div>
                {allAnswered && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Passing score:</span>
                      <span className="font-medium text-gray-900">
                        {PASSING_SCORE}/{questions.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
