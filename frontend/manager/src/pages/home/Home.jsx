import React from 'react';
import LandingNavbar from '../../components/landing/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import PlatformWorkflow from '../../components/landing/PlatformWorkflow';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300 selection:bg-primary-main selection:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlatformWorkflow />
        
        {/* Dashboard Preview Section (Internal Component) */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Data Intelligence</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                Enterprise Analytics <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-indigo-500">
                  Built for Leaders
                </span>
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Experience the clarity of live data. Monitor field team execution, revenue collection, and route compliance instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Analytics Card 1 */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-500">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Real-Time Visits</p>
                <div className="h-40 flex items-end justify-between space-x-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary-main/10 dark:bg-primary-main/20 rounded-t-lg group relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-primary-main group-hover:bg-indigo-500 transition-all rounded-t-lg" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">2,481</span>
                  <span className="text-xs font-bold text-emerald-500">+12% Today</span>
                </div>
              </div>

              {/* Analytics Card 2 */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-500 scale-105 z-10">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Total Revenue Collected</p>
                <div className="flex flex-col space-y-4">
                  <div className="w-full h-4 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  </div>
                  <div className="w-full h-4 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-gradient-to-r from-indigo-500 to-indigo-400" />
                  </div>
                  <div className="w-full h-4 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-gradient-to-r from-amber-500 to-amber-400" />
                  </div>
                </div>
                <div className="mt-10 flex items-center justify-between">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">$84,290</span>
                  <span className="text-xs font-bold text-emerald-500">Live Target</span>
                </div>
              </div>

              {/* Analytics Card 3 */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-500">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Active Compliance</p>
                <div className="relative w-32 h-32 mx-auto">
                   <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset="36.4" className="text-primary-main" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">90%</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary-main" />
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Verified Visits</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
