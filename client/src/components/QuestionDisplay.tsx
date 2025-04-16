import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Question } from "@shared/schema";

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  onNextQuestion,
  isLastQuestion,
}: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return; // Prevent selecting after feedback is shown
    
    setSelectedOption(optionIndex);
    setShowFeedback(true);
  };
  
  const isCorrect = selectedOption === question.correctOption;
  
  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    onNextQuestion();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-medium text-neutral-900 mb-6">
          {question.text}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`border-2 rounded-md p-4 cursor-pointer transition-colors duration-150 ${
                showFeedback && selectedOption === index && !isCorrect
                  ? "border-error bg-error bg-opacity-10"
                  : showFeedback && question.correctOption === index
                  ? "border-success bg-success bg-opacity-10"
                  : selectedOption === index
                  ? "border-primary"
                  : "border-neutral-200 hover:border-primary"
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full border-2 border-neutral-300 flex items-center justify-center flex-shrink-0 mr-3">
                  <span className="font-medium text-neutral-700">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <div>
                  <p className="text-neutral-800">{option}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showFeedback && (
        <div className="mb-6">
          {isCorrect ? (
            <div className="bg-success bg-opacity-10 border border-success rounded-md p-4 flex items-start">
              <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mr-3" />
              <div>
                <p className="font-medium text-success">Correct!</p>
                {question.explanation && (
                  <p className="text-neutral-700 mt-1">{question.explanation}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-error bg-opacity-10 border border-error rounded-md p-4 flex items-start">
              <AlertCircle className="h-6 w-6 text-error flex-shrink-0 mr-3" />
              <div>
                <p className="font-medium text-error">Incorrect</p>
                <p className="text-neutral-700 mt-1">
                  The correct answer is {String.fromCharCode(65 + question.correctOption)}: {question.options[question.correctOption]}
                  {question.explanation && `. ${question.explanation}`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end">
        {showFeedback && (
          <Button 
            onClick={handleNext} 
            className="bg-primary hover:bg-primary-dark text-white py-2 px-6"
          >
            {isLastQuestion ? "Finish Test" : "Next Question"}
          </Button>
        )}
      </div>
    </>
  );
}
