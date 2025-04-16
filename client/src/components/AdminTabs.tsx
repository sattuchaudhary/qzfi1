import { Link } from "wouter";

type TabType = "categories" | "tests" | "questions";

interface AdminTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="border-b border-neutral-200">
      <nav className="flex -mb-px">
        <a
          href="#"
          className={`${
            activeTab === "categories"
              ? "border-primary text-primary border-b-2"
              : "text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 border-transparent border-b-2"
          } py-4 px-6 font-medium text-sm`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange("categories");
          }}
        >
          Categories
        </a>
        <a
          href="#"
          className={`${
            activeTab === "tests"
              ? "border-primary text-primary border-b-2"
              : "text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 border-transparent border-b-2"
          } py-4 px-6 font-medium text-sm`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange("tests");
          }}
        >
          Tests
        </a>
        <a
          href="#"
          className={`${
            activeTab === "questions"
              ? "border-primary text-primary border-b-2"
              : "text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 border-transparent border-b-2"
          } py-4 px-6 font-medium text-sm`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange("questions");
          }}
        >
          Questions
        </a>
      </nav>
    </div>
  );
}
