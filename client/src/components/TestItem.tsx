import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Test } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TestItemProps {
  test: Test;
}

export default function TestItem({ test }: TestItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 test-item">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-medium text-neutral-900 mb-1">{test.name}</h3>
          <div className="flex items-center text-neutral-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Added: {test.uploadDate ? formatDistanceToNow(new Date(test.uploadDate), { addSuffix: true }) : "Recently"}</span>
            {test.timeLimit && (
              <>
                <span className="mx-2">•</span>
                <span>{test.timeLimit} minutes</span>
              </>
            )}
          </div>
        </div>
        <Link href={`/test/${test.id}`}>
          <Button className="bg-secondary hover:bg-secondary-dark text-white py-2 px-6">
            Start Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
