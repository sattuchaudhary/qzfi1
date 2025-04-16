import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-xl font-heading font-bold text-primary mr-2">QZFI</span>
            <span className="text-neutral-600">- Test Your Knowledge</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-500 hover:text-neutral-700">
              About
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700">
              Contact
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700">
              Privacy Policy
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} QZFI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
