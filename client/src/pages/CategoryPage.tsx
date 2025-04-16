import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Category, Test } from "@shared/schema";
import TestItem from "@/components/TestItem";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:id");
  const categoryId = params?.id ? parseInt(params.id) : 0;

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: !!categoryId,
  });

  const { data: tests, isLoading: testsLoading } = useQuery<Test[]>({
    queryKey: [`/api/tests`, { categoryId }],
    enabled: !!categoryId,
  });

  const isLoading = categoryLoading || testsLoading;

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary-dark">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Categories
          </Link>
        </div>
        
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-8" />
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <Skeleton className="h-6 w-64 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : category ? (
          <>
            <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
              {category.name}
            </h2>
            <p className="text-neutral-600 mb-8">{category.description}</p>

            {tests && tests.length > 0 ? (
              <div className="space-y-4">
                {tests.map((test) => (
                  <TestItem key={test.id} test={test} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-neutral-600">No tests found in this category. Please check back later.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-neutral-600">Category not found.</p>
            <Link href="/" className="text-primary hover:text-primary-dark mt-4 inline-block">
              Return to Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
