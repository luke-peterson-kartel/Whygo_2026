import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onAnswer?: (isCorrect: boolean) => void;
}

export function QuizQuestion({
  question,
  options,
  correctIndex,
  explanation,
  onAnswer,
}: QuizQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedIndex(index);
    setShowFeedback(true);
    const isCorrect = index === correctIndex;
    onAnswer?.(isCorrect);
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      {/* Question */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">{question}</h3>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === correctIndex;
          const showAsCorrect = showFeedback && isCorrectOption;
          const showAsWrong = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showFeedback && handleAnswer(index)}
              disabled={showFeedback}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${showFeedback ? 'cursor-default' : 'cursor-pointer hover:border-blue-400'}
                ${showAsCorrect ? 'border-green-500 bg-green-50' : ''}
                ${showAsWrong ? 'border-red-500 bg-red-50' : ''}
                ${!showFeedback && isSelected ? 'border-blue-500 bg-blue-50' : ''}
                ${!showFeedback && !isSelected ? 'border-gray-300' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{option}</span>
                {showAsCorrect && (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {showAsWrong && (
                  <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`
            p-4 rounded-lg border-2
            ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}
          `}
        >
          {isCorrect ? (
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 mb-1">Correct!</p>
                <p className="text-sm text-gray-700">{explanation}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <XCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 mb-1">Not quite</p>
                <p className="text-sm text-gray-700">{explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
