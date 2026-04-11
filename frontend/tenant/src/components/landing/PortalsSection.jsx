import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Building, Users, User, ArrowRight } from 'lucide-react';

const PortalCard = ({ title, description, icon: Icon, path, role, colorClass }) => (
  <div className="group p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-primary-main/20 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`} />
    
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${colorClass} text-white`}>
      <Icon size={36} />
    </div>
    
    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
      {description}
    </p>
    
    <Link 
      to={path}
      className={`mt-auto w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 border-2 ${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} group-hover:bg-primary-main group-hover:border-primary-main group-hover:text-white`}
    >
      <span>Login to Portal</span>
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const PortalsSection = () => {
  const portals = [
    {
      title: "Super Admin Portal",
      description: "Global infrastructure management, tenant onboarding, and platform-wide analytics.",
      icon: ShieldCheck,
      path: "/login",
      role: "superadmin",
      colorClass: "bg-indigo-600 text-indigo-600"
    },
    {
      title: "Tenant Portal",
      description: "Company-level administration, manager hierarchy, and organizational oversight.",
      icon: Building,
      path: "/login",
      role: "tenant",
      colorClass: "bg-emerald-600 text-emerald-600"
    },
    {
      title: "Manager Portal",
      description: "Real-time team monitoring, route tracking, and performance analysis.",
      icon: Users,
      path: "/login",
      role: "manager",
      colorClass: "bg-amber-600 text-amber-600"
    },
    {
      title: "Employee Portal",
      description: "Personalized task board, visit tracking, and digital order collection system.",
      icon: User,
      path: "/login",
      role: "employee",
      colorClass: "bg-rose-600 text-rose-600"
    }
  ];

  return (
    <section id="portals" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Unified Access</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Specialized Interfaces for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-indigo-500">
              Every Stakeholder
            </span>
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed pt-2">
            TrackForce is built with a modular architecture, providing tailored experiences and 
            security levels for different user roles within the ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {portals.map((portal, index) => (
            <PortalCard key={index} {...portal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortalsSection;
