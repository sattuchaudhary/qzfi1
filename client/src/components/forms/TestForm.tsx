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
import { Category, Test, insertTestSchema } from "@shared/schema";

const formSchema = insertTestSchema.extend({
  name: z.string().min(3, {
    message: "Test name must be at least 3 characters.",
  }),
  categoryId: z.coerce.number({
    required_error: "Please select a category",
    invalid_type_error: "Category ID must be a number",
  }),
  timeLimit: z.coerce.number().min(1).max(180).optional(),
});

interface TestFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: Test | null;
  categories: Category[];
  isLoading?: boolean;
  onCancel: () => void;
}

export default function TestForm({ 
  onSubmit, 
  initialData, 
  categories, 
  isLoading, 
  onCancel 
}: TestFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: initialData?.categoryId || undefined,
      timeLimit: initialData?.timeLimit || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Weekly Current Affairs Quiz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
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
          name="timeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Limit (minutes, optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 15" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : parseInt(value));
                  }}
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
            {isLoading ? "Saving..." : initialData ? "Update Test" : "Create Test"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
