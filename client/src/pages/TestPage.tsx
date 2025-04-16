import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Test, Question } from "@shared/schema";
import QuestionDisplay from "@/components/QuestionDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, ClipboardList, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function TestPage() {
  const [match, params] = useRoute("/test/:id");
  const testId = params?.id ? parseInt(params.id) : 0;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: test, isLoading: testLoading } = useQuery<Test>({
    queryKey: [`/api/tests/${testId}`],
    enabled: !!testId,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: [`/api/questions`, { testId }],
    enabled: !!testId,
  });

  const isLoading = testLoading || questionsLoading;
  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/category/${test?.categoryId}`} className="inline-flex items-center text-primary hover:text-primary-dark">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Tests
          </Link>
        </div>
        
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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
          <div className="text-center py-10">
            <p className="text-neutral-600">Test not found or no questions available.</p>
            <Link href="/" className="text-primary hover:text-primary-dark mt-4 inline-block">
              Return to Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
