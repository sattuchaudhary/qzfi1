import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Question, Test, insertQuestionSchema } from "@shared/schema";
import { PlusCircle, Trash2 } from "lucide-react";

// Create a custom form schema based on the insert schema
const formSchema = z.object({
  testId: z.coerce.number({
    required_error: "Please select a test",
    invalid_type_error: "Test ID must be a number",
  }),
  text: z.string().min(5, {
    message: "Question text must be at least 5 characters.",
  }),
  option1: z.string().min(1, { message: "Option is required" }),
  option2: z.string().min(1, { message: "Option is required" }),
  option3: z.string().min(1, { message: "Option is required" }),
  option4: z.string().min(1, { message: "Option is required" }),
  correctOption: z.coerce.number().min(0).max(3),
  explanation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface QuestionFormProps {
  onSubmit: (data: z.infer<typeof insertQuestionSchema>) => void;
  initialData?: Question | null;
  tests: Test[];
  preSelectedTestId?: number;
  isLoading?: boolean;
  onCancel: () => void;
}

export default function QuestionForm({ 
  onSubmit, 
  initialData, 
  tests, 
  preSelectedTestId,
  isLoading, 
  onCancel 
}: QuestionFormProps) {
  // Transform the initial data to match our form schema
  const getDefaultValues = (): Partial<FormValues> => {
    if (initialData) {
      return {
        testId: initialData.testId,
        text: initialData.text,
        option1: initialData.options[0] || "",
        option2: initialData.options[1] || "",
        option3: initialData.options[2] || "",
        option4: initialData.options[3] || "",
        correctOption: initialData.correctOption,
        explanation: initialData.explanation || "",
      };
    }
    
    return {
      testId: preSelectedTestId,
      text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: 0,
      explanation: "",
    };
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });
  
  // Transform the form data back to the schema expected by the API
  const handleSubmit = (values: FormValues) => {
    const { option1, option2, option3, option4, ...rest } = values;
    
    const questionData = {
      ...rest,
      options: [option1, option2, option3, option4],
    };
    
    onSubmit(questionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="testId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
                disabled={!!preSelectedTestId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a test" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tests.map((test) => (
                    <SelectItem key={test.id} value={test.id.toString()}>
                      {test.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the question here..." 
                  {...field} 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Answer Options</h4>
          
          {/* Option 1 */}
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="option1"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-neutral-300 flex items-center justify-center flex-shrink-0 mr-2">
                      <span className="font-medium text-neutral-700">A</span>
                    </div>
                    <FormControl>
                      <Input placeholder="Option A" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="correctOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="radio"
                      checked={field.value === 0}
                      onChange={() => field.onChange(0)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Option 2 */}
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="option2"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-neutral-300 flex items-center justify-center flex-shrink-0 mr-2">
                      <span className="font-medium text-neutral-700">B</span>
                    </div>
                    <FormControl>
                      <Input placeholder="Option B" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="correctOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="radio"
                      checked={field.value === 1}
                      onChange={() => field.onChange(1)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Option 3 */}
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="option3"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-neutral-300 flex items-center justify-center flex-shrink-0 mr-2">
                      <span className="font-medium text-neutral-700">C</span>
                    </div>
                    <FormControl>
                      <Input placeholder="Option C" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="correctOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="radio"
                      checked={field.value === 2}
                      onChange={() => field.onChange(2)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Option 4 */}
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="option4"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-neutral-300 flex items-center justify-center flex-shrink-0 mr-2">
                      <span className="font-medium text-neutral-700">D</span>
                    </div>
                    <FormControl>
                      <Input placeholder="Option D" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="correctOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="radio"
                      checked={field.value === 3}
                      onChange={() => field.onChange(3)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explain the correct answer..." 
                  {...field} 
                  value={field.value || ""}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Question" : "Create Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
