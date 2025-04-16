import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Question, InsertQuestion, Test } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QuestionForm from "@/components/forms/QuestionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminQuestionsTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const { data: tests, isLoading: testsLoading } = useQuery<Test[]>({
    queryKey: ["/api/tests"],
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions", { testId: selectedTestId ? parseInt(selectedTestId) : undefined }],
    enabled: selectedTestId !== null,
  });

  const isLoading = testsLoading || (selectedTestId !== null && questionsLoading);

  const createMutation = useMutation({
    mutationFn: async (data: InsertQuestion) => {
      const res = await apiRequest("POST", "/api/questions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({
        title: "Success",
        description: "Question created successfully",
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create question",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertQuestion }) => {
      const res = await apiRequest("PUT", `/api/questions/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
      setDialogOpen(false);
      setEditingQuestion(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update question",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: InsertQuestion) => {
    if (editingQuestion) {
      updateMutation.mutate({ id: editingQuestion.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingQuestion(null);
  };

  const getTestName = (testId: number) => {
    if (!tests) return "Loading...";
    const test = tests.find(t => t.id === testId);
    return test ? test.name : "Unknown Test";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-medium text-neutral-900">Manage Questions</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-md flex items-center"
              onClick={() => setEditingQuestion(null)}
              disabled={!selectedTestId && !editingQuestion}
            >
              <PlusCircle className="h-5 w-5 mr-1" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </DialogTitle>
            </DialogHeader>
            <QuestionForm 
              onSubmit={handleSubmit}
              initialData={editingQuestion}
              tests={tests || []}
              preSelectedTestId={selectedTestId ? parseInt(selectedTestId) : undefined}
              isLoading={createMutation.isPending || updateMutation.isPending || isLoading}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Select Test to View/Add Questions
        </label>
        <Select
          value={selectedTestId || ""}
          onValueChange={(value) => setSelectedTestId(value || null)}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a test" />
          </SelectTrigger>
          <SelectContent>
            {testsLoading ? (
              <SelectItem value="loading" disabled>Loading tests...</SelectItem>
            ) : tests && tests.length > 0 ? (
              tests.map((test) => (
                <SelectItem key={test.id} value={test.id.toString()}>
                  {test.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No tests available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        {selectedTestId === null ? (
          <div className="text-center py-10 border rounded-md bg-neutral-50">
            <p className="text-neutral-600">Please select a test to view its questions.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex justify-between p-4 border rounded-md">
                <Skeleton className="h-6 w-full max-w-lg mb-2" />
                <div className="flex space-x-3">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : questions && questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{question.text}</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary-dark"
                      onClick={() => handleEdit(question)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-error hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this question and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(question.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {question.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`p-2 border rounded-md text-sm ${
                        index === question.correctOption 
                          ? "border-green-500 bg-green-50" 
                          : "border-neutral-200"
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}:</span> {option}
                      {index === question.correctOption && (
                        <span className="ml-2 text-green-600 text-xs font-medium">(Correct)</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="mt-2 text-sm text-neutral-600">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md bg-neutral-50">
            <p className="text-neutral-600">No questions found for this test. Add your first question.</p>
          </div>
        )}
      </div>
    </div>
  );
}
