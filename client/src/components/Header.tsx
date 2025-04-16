import { Link, useLocation } from "wouter";
import { CheckCircle, LightbulbIcon, BookOpen, User, Search, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-heading font-bold">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mr-2 shadow-md">
                <LightbulbIcon className="h-6 w-6" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">QZFI</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              <li>
                <Link 
                  href="/" 
                  className={`px-4 py-2.5 rounded-md transition duration-150 flex items-center ${
                    location === "/" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  <span>Browse</span>
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="px-4 py-2.5 rounded-md text-neutral-700 hover:bg-neutral-100 transition duration-150 flex items-center"
                >
                  <User className="h-4 w-4 mr-1.5" />
                  <span>My Tests</span>
                </a>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className={`px-4 py-2.5 rounded-md transition duration-150 flex items-center ${
                    location === "/admin" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              className="p-2.5 rounded-md text-neutral-700 hover:bg-neutral-100 transition duration-150"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>
            <Button className="btn-primary-gradient">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="p-2 rounded-md text-neutral-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 md:hidden border-t pt-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-4 py-3 rounded-md transition duration-150 ${
                  location === "/" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <a 
                href="#" 
                className="px-4 py-3 rounded-md text-neutral-700 hover:bg-neutral-100 transition duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Tests
              </a>
              <Link 
                href="/admin" 
                className={`px-4 py-3 rounded-md transition duration-150 ${
                  location === "/admin" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="pt-2 border-t">
                <Button className="w-full btn-primary-gradient mt-3">
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Search overlay */}
        {searchOpen && (
          <div className="mt-4 relative">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search for quizzes, topics..." 
                className="w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
