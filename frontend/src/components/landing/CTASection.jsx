import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-primary-main rounded-[3rem] p-12 lg:p-20 overflow-hidden shadow-2xl shadow-primary-main/30">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-20 -mb-20 blur-3xl animate-pulse delay-700" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <Sparkles className="text-white" size={16} />
              <span className="text-xs font-black text-white uppercase tracking-widest">Enterprise Ready</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Start Managing Your Field <br />
              Workforce Smarter
            </h2>
            
            <p className="text-lg md:text-xl text-primary-main/10 text-white/80 font-medium leading-relaxed">
              Join 120+ global companies optimizing their field operations with TrackForce. 
              Get started today and see the difference in team performance.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-10 py-5 bg-white text-primary-main rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
              >
                Start Free Trial
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-primary-main/20 text-white border border-white/20 rounded-2xl font-black hover:bg-primary-main/30 backdrop-blur-sm transition-all flex items-center justify-center">
                Request Custom Demo
              </button>
            </div>
            
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest pt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
