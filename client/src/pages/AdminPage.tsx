import { useState } from "react";
import AdminTabs from "@/components/AdminTabs";
import AdminCategoriesTab from "@/components/AdminCategoriesTab";
import AdminTestsTab from "@/components/AdminTestsTab";
import AdminQuestionsTab from "@/components/AdminQuestionsTab";

type TabType = "categories" | "tests" | "questions";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("categories");

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-8">Admin Panel</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === "categories" && <AdminCategoriesTab />}
          {activeTab === "tests" && <AdminTestsTab />}
          {activeTab === "questions" && <AdminQuestionsTab />}
        </div>
      </div>
    </div>
  );
}
