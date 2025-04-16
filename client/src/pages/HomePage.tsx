import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import CategoryCard from "@/components/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Quiz Categories</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                testCount={15} // In a real app, this would come from the API
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-neutral-600">No categories found. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
