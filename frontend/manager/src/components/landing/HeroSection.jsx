import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Users, MapPin, BarChart3, ShieldCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-main/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-main/5 dark:bg-primary-main/10 border border-primary-main/10 dark:border-primary-main/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-main opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-main"></span>
              </span>
              <span className="text-[10px] font-black text-primary-main uppercase tracking-widest">v2.4 is now live</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              Track Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-indigo-500">
                Field Workforce
              </span> <br />
              in Real-Time
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              A powerful SaaS platform for managing field executives, tracking visits, 
              monitoring routes, and analyzing team performance with enterprise-grade security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-primary-main text-white rounded-2xl font-black shadow-xl shadow-primary-main/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
              >
                Get Started Free
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center">
                <Play className="mr-2 fill-current" size={16} />
                Watch Demo
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start space-x-8">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-gray-900 dark:text-white">15k+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Active Users</p>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-gray-900 dark:text-white">120+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Global Companies</p>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-gray-900 dark:text-white">99.9%</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Uptime</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            {/* Main Dashboard Preview Mockup */}
            <div className="relative z-10 bg-white dark:bg-gray-900 p-3 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="bg-gray-50 dark:bg-gray-950 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bbda48652ad8?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dashboard Analytics" 
                  className="w-full h-auto opacity-90 grayscale-[20%] group-hover:grayscale-0 transition-all"
                />
              </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute -top-10 -right-10 z-20 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce delay-500">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">On-Duty</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">1,240</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 z-20 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Routes</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">342</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-20 -translate-y-1/2 z-0 w-64 h-64 bg-primary-main/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
