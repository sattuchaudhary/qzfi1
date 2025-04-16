import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Category, Test } from "@shared/schema";
import TestItem from "@/components/TestItem";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, BookOpen, Filter, Search, 
  Clock, CalendarDays, BarChart2, GridIcon, ListIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:id");
  const categoryId = params?.id ? parseInt(params.id) : 0;
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: !!categoryId,
  });

  const { data: tests, isLoading: testsLoading } = useQuery<Test[]>({
    queryKey: [`/api/tests`, { categoryId }],
    enabled: !!categoryId,
  });

  const isLoading = categoryLoading || testsLoading;

  // Filter tests based on search query
  const filteredTests = tests?.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary-dark py-2 px-4 rounded-md hover:bg-primary/5 transition-colors"
          >
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
            {/* Category Header with Gradient Background */}
            <div className="bg-gradient-to-r from-primary/90 to-primary rounded-xl overflow-hidden mb-8">
              <div className="p-8 md:p-10 text-white">
                <div className="flex items-center mb-4">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-heading font-bold">
                    {category.name}
                  </h2>
                </div>
                <p className="text-white/90 max-w-2xl mb-4">{category.description}</p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>{tests?.length || 0} Tests Available</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Updated Recently</span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>Beginner to Advanced</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <ListIcon className="h-5 w-5" />
                    </button>
                    <button
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <GridIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Filter Panel - Collapsible */}
              {filterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>All Levels</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Any Duration</option>
                        <option>Under 15 minutes</option>
                        <option>15-30 minutes</option>
                        <option>Over 30 minutes</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Newest First</option>
                        <option>Popular</option>
                        <option>A-Z</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {filteredTests && filteredTests.length > 0 ? (
              viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredTests.map((test) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TestItem test={test} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTests.map((test) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow overflow-hidden card-hover"
                    >
                      <div className="h-3 bg-gradient-to-r from-primary/80 to-primary"></div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">{test.name}</h3>
                        <div className="flex items-center text-neutral-500 text-sm mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{test.timeLimit || '—'} {test.timeLimit ? 'minutes' : ''}</span>
                        </div>
                        <Link href={`/test/${test.id}`}>
                          <Button className="w-full btn-primary-gradient">
                            Start Test
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 glass-effect rounded-lg border">
                <Search className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                <p className="text-neutral-600 mb-4">
                  {searchQuery 
                    ? `No tests matching "${searchQuery}" found in this category.` 
                    : "No tests found in this category. Please check back later."}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 glass-effect rounded-lg border">
            <BookOpen className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
            <p className="text-neutral-600 mb-6">Category not found.</p>
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
