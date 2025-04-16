import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Test, Question } from "@shared/schema";
import QuestionDisplay from "@/components/QuestionDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, Calendar, ClipboardList, Clock, 
  AlertTriangle, Trophy, Award, BarChart
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [match, params] = useRoute("/test/:id");
  const testId = params?.id ? parseInt(params.id) : 0;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [testCompleted, setTestCompleted] = useState(false);

  const { data: test, isLoading: testLoading } = useQuery<Test>({
    queryKey: [`/api/tests/${testId}`],
    enabled: !!testId,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: [`/api/questions`, { testId }],
    enabled: !!testId,
  });

  // Initialize timer when test data is loaded
  useEffect(() => {
    if (test?.timeLimit && !testCompleted) {
      setTimeRemaining(test.timeLimit * 60); // Convert minutes to seconds
      
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [test, testCompleted]);

  const isLoading = testLoading || questionsLoading;
  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;

  const handleNextQuestion = () => {
    // Record this question as answered
    if (!answeredQuestions.includes(currentQuestionIndex)) {
      setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
      
      // Increment score (simulated for demo - in real app would be based on actual correct answers)
      if (Math.random() > 0.3) { // 70% chance of correct answer for demo
        setScore(prev => prev + 1);
      }
    }
    
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test completed
      setTestCompleted(true);
    }
  };

  // Format remaining time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = questions && questions.length > 0
    ? Math.round((answeredQuestions.length / questions.length) * 100)
    : 0;

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href={`/category/${test?.categoryId}`} className="inline-flex items-center text-primary hover:text-primary-dark py-2 px-4 rounded-md hover:bg-primary/5 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Tests
          </Link>
          
          {test?.timeLimit && timeRemaining !== null && !testCompleted && (
            <div className={`flex items-center font-mono ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-neutral-700'}`}>
              <Clock className="h-5 w-5 mr-1" />
              <span className="text-lg font-medium">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {!isLoading && questions && !testCompleted && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 text-sm text-neutral-600">
              <span>Progress</span>
              <span>{answeredQuestions.length} of {questions.length} questions</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        {isLoading ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <Skeleton className="h-7 w-3/4 mb-2" />
              <div className="flex flex-wrap items-center">
                <Skeleton className="h-4 w-24 mr-4 mb-2" />
                <Skeleton className="h-4 w-36 mr-4 mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Skeleton className="h-6 w-full mb-6" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-2 border-neutral-200 rounded-md p-4">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full border-2 border-neutral-300 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="font-medium text-neutral-700">{String.fromCharCode(65 + i)}</span>
                      </div>
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : test && questions && questions.length > 0 ? (
          <>
            {!testCompleted ? (
              <>
                <div className="bg-white rounded-lg shadow p-6 mb-8 glass-effect">
                  <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">
                    {test.name}
                  </h2>
                  <div className="flex flex-wrap items-center text-neutral-600 text-sm">
                    <span className="inline-flex items-center mr-4 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{test.uploadDate ? formatDistanceToNow(new Date(test.uploadDate), { addSuffix: true }) : "Recently added"}</span>
                    </span>
                    <span className="inline-flex items-center mr-4 mb-2">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    </span>
                    {test.timeLimit && (
                      <span className="inline-flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{test.timeLimit} minutes</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {currentQuestion && (
                  <QuestionDisplay
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    onNextQuestion={handleNextQuestion}
                    isLastQuestion={currentQuestionIndex === questions.length - 1}
                  />
                )}
              </>
            ) : (
              /* Test Complete Screen */
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-8 text-white text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <Trophy className="h-12 w-12" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
                  <p className="text-white/90">
                    You've successfully completed {test.name}
                  </p>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-center p-4 border rounded-lg flex-1 mx-2">
                      <div className="flex justify-center mb-2">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-neutral-900 mb-1">
                        {score} / {questions.length}
                      </div>
                      <div className="text-sm text-neutral-600">Score</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg flex-1 mx-2">
                      <div className="flex justify-center mb-2">
                        <BarChart className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-neutral-900 mb-1">
                        {Math.round((score / questions.length) * 100)}%
                      </div>
                      <div className="text-sm text-neutral-600">Accuracy</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg flex-1 mx-2">
                      <div className="flex justify-center mb-2">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-neutral-900 mb-1">
                        {test.timeLimit ? test.timeLimit - Math.floor((timeRemaining || 0) / 60) : "--"}m
                      </div>
                      <div className="text-sm text-neutral-600">Time Taken</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-neutral-700 mb-6">
                      Great job! You've earned a new achievement badge.
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <Link href={`/category/${test.categoryId}`}>
                        <Button variant="outline" className="px-8">
                          More Tests
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button className="btn-primary-gradient px-8">
                          Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 glass-effect rounded-lg">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <p className="text-neutral-600 mb-6">Test not found or no questions available.</p>
            <Link href="/">
              <Button className="btn-primary-gradient">
                Return to Categories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
