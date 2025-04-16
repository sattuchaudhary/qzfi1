import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  testCount: number;
}

export default function CategoryCard({ category, testCount }: CategoryCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-neutral-900">{category.name}</h3>
          <span className="bg-primary-light text-white text-xs px-2 py-1 rounded-full">
            {testCount} Tests
          </span>
        </div>
        <p className="text-neutral-600 mb-6">{category.description}</p>
        <Link href={`/category/${category.id}`}>
          <Button className="w-full bg-primary hover:bg-primary-dark text-white">
            View Tests
          </Button>
        </Link>
      </div>
    </Card>
  );
}
