import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, ArrowRight, Brain } from "lucide-react";
import { Question } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

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
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Reset timer when question changes
  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [question.id, startTime]);
  
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
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">{question.text}</h3>
            </div>
            <div className="text-sm text-neutral-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{elapsedTime}s</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className={`quiz-option ${
                  showFeedback && selectedOption === index && !isCorrect
                    ? "quiz-option-incorrect"
                    : showFeedback && question.correctOption === index
                    ? "quiz-option-correct"
                    : selectedOption === index
                    ? "quiz-option-selected"
                    : "quiz-option-normal"
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="flex items-start">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                    showFeedback && question.correctOption === index
                      ? "bg-green-500 text-white"
                      : showFeedback && selectedOption === index
                      ? "bg-red-500 text-white"
                      : selectedOption === index
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  }`}>
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <div className="pt-1">
                    <p className="text-neutral-800">{option}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {isCorrect ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start">
                <div className="bg-green-500 text-white h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-green-700 text-lg mb-1">Correct Answer!</p>
                  {question.explanation && (
                    <p className="text-neutral-700">{question.explanation}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
                <div className="bg-red-500 text-white h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-red-700 text-lg mb-1">Incorrect Answer</p>
                  <p className="text-neutral-700 mb-2">
                    The correct answer is <span className="font-medium">{String.fromCharCode(65 + question.correctOption)}: {question.options[question.correctOption]}</span>
                  </p>
                  {question.explanation && (
                    <p className="text-neutral-700 border-t border-red-100 pt-2">{question.explanation}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-neutral-500">
            Question {questionNumber} of {totalQuestions}
          </div>
          {showFeedback && (
            <Button 
              onClick={handleNext} 
              className="btn-primary-gradient py-2 px-6"
            >
              {isLastQuestion ? "Finish Test" : "Next Question"} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
