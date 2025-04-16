import { Link } from "wouter";
import { LightbulbIcon, Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Stay Updated</h3>
            <p className="text-neutral-600 mb-6">
              Subscribe to our newsletter for the latest quizzes, challenges and learning resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="btn-primary-gradient">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Footer */}
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white mr-2">
                  <LightbulbIcon className="h-6 w-6" />
                </div>
                <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">QZFI</span>
              </div>
              <p className="text-neutral-600 mb-6">
                The leading platform for interactive quizzes and educational content.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-500 hover:text-primary transition duration-150">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-neutral-500 hover:text-primary transition duration-150">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-neutral-500 hover:text-primary transition duration-150">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-neutral-500 hover:text-primary transition duration-150">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Links Columns */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Explore</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Categories</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Popular Quizzes</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">New Additions</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Featured Content</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Help Center</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Blog</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Tutorials</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Terms of Service</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Cookie Policy</a></li>
                <li><a href="#" className="text-neutral-600 hover:text-primary transition duration-150">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-neutral-200 px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-neutral-500 text-sm">
            &copy; {currentYear} QZFI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
