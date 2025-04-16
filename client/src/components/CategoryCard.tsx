import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@shared/schema";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface CategoryCardProps {
  category: Category;
  testCount: number;
  icon?: LucideIcon;
}

export default function CategoryCard({ category, testCount, icon: Icon }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="bg-white rounded-lg shadow-md overflow-hidden card-hover relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative top border with gradient */}
      <div className="h-2 bg-gradient-to-r from-primary/80 to-primary"></div>
      
      <div className="p-8">
        <div className="flex items-start mb-6">
          {Icon && (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${isHovered ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <Icon className="h-7 w-7" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1">{category.name}</h3>
            <span className="badge-gradient text-xs px-3 py-1 rounded-full">
              {testCount} Tests Available
            </span>
          </div>
        </div>
        
        <p className="text-neutral-600 mb-8 line-clamp-3">{category.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {/* Circle avatars representing users */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
              +{testCount > 3 ? testCount - 3 : 0}
            </div>
          </div>
          
          <Link href={`/category/${category.id}`}>
            <Button className="btn-primary-gradient px-6">
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
