import { CheckCircleIcon } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  currentStep: number;
  steps: { title: string }[];
}

export function ProgressTracker({ currentStep, steps }: ProgressTrackerProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        Learning Progress
      </h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center gap-3">
              {/* Step Indicator */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0
                  ${isCompleted ? 'bg-green-500' : ''}
                  ${isCurrent ? 'bg-blue-500' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-300' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </div>

              {/* Step Title */}
              <span
                className={`text-sm ${
                  isCompleted ? 'text-gray-900 font-medium' : ''
                } ${isCurrent ? 'text-blue-600 font-semibold' : ''} ${
                  !isCompleted && !isCurrent ? 'text-gray-500' : ''
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
