import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import CategoryCard from "@/components/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Brain, Trophy, Clock, BarChart, Award } from "lucide-react";

// Icons for each category to make the UI more visual
const CATEGORY_ICONS: Record<number, any> = {
  1: Brain,
  2: Book,
  3: Trophy,
  4: Clock,
  5: BarChart,
  6: Award,
};

export default function HomePage() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="py-10">
      {/* Hero Banner */}
      <div className="hero-gradient text-white mb-16 rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Test Your Knowledge with <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">QZFI</span>
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Explore diverse quiz categories, challenge yourself, and track your progress. Start your learning journey today!
            </p>
            <div className="flex gap-4">
              <button className="btn-secondary-gradient px-8 py-3 rounded-lg font-medium shadow-lg">
                Get Started
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900">Quiz Categories</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-primary font-medium">Sort by:</span>
            <select className="p-2 border rounded-md text-neutral-700 bg-white">
              <option>Popular</option>
              <option>Recent</option>
              <option>A-Z</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                testCount={category.id * 5} // Simulating different test counts based on category ID
                icon={CATEGORY_ICONS[category.id] || Brain}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-effect rounded-lg border">
            <Brain className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600">No categories found. Please check back later.</p>
          </div>
        )}
        
        {/* Statistics Section */}
        <div className="mt-24 mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-10 text-center">
            Why Choose QZFI?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center card-hover">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1000+ Quizzes</h3>
              <p className="text-neutral-600">Access a vast collection of quizzes across multiple categories</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center card-hover">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-neutral-600">Monitor your performance with detailed analytics</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center card-hover">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Earn Badges</h3>
              <p className="text-neutral-600">Complete challenges and collect achievement badges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
