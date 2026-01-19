import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  nextPath?: string;
  prevPath?: string;
  nextLabel?: string;
  prevLabel?: string;
  canProceed?: boolean;
  onNext?: () => void;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  nextPath,
  prevPath,
  nextLabel = 'Next Step',
  prevLabel = 'Previous Step',
  canProceed = true,
  onNext,
}: StepNavigationProps) {
  const showPrev = currentStep > 1 && prevPath;
  const showNext = currentStep < totalSteps && nextPath;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {/* Previous Button */}
      <div>
        {showPrev ? (
          <Link
            to={prevPath}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{prevLabel}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Next Button */}
      <div>
        {showNext && (
          nextPath && !onNext ? (
            <Link
              to={nextPath}
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${
                  canProceed
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              onClick={(e) => {
                if (!canProceed) {
                  e.preventDefault();
                }
              }}
            >
              <span>{nextLabel}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          ) : onNext ? (
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${
                  canProceed
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span>{nextLabel}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}
