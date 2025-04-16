import { Link, useLocation } from "wouter";
import { CheckCircle } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-primary">
          <Link href="/" className="flex items-center">
            <CheckCircle className="h-8 w-8 mr-2 text-primary" />
            QZFI
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`${location === "/" ? "text-primary font-medium" : "text-neutral-700"} hover:text-primary transition duration-150`}
              >
                Home
              </Link>
            </li>
            <li>
              <a href="#" className="text-neutral-700 hover:text-primary transition duration-150">
                My Tests
              </a>
            </li>
            <li>
              <Link 
                href="/admin" 
                className={`${location === "/admin" ? "text-primary font-medium" : "text-neutral-700"} hover:text-primary transition duration-150`}
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
