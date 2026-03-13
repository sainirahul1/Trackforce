import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, ChevronRight } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Portals', href: '#portals' },
    { name: 'Workflow', href: '#workflow' },
  ];

  const portals = [
    { name: 'Super Admin', path: '/login', role: 'superadmin' },
    { name: 'Tenant', path: '/login', role: 'tenant' },
    { name: 'Manager', path: '/login', role: 'manager' },
    { name: 'Employee', path: '/login', role: 'employee' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary-main rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white">TrackForce</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold text-gray-500 hover:text-primary-main dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
          <div className="flex items-center space-x-3">
             <Link 
              to="/login" 
              className="px-6 py-2.5 rounded-2xl text-sm font-black text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Log In
            </Link>
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-primary-main text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-main/20 hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        <button 
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-bold text-gray-900 dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-gray-100 dark:border-gray-800" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link to="/login" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-center text-sm font-black dark:text-white">Log In</Link>
              <Link to="/login" className="px-6 py-3 bg-primary-main text-white rounded-2xl text-center text-sm font-black">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
