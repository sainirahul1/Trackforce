import React from 'react';
import { 
  MapPin, 
  ClipboardList, 
  Navigation, 
  ShoppingCart, 
  Building2, 
  BarChart3, 
  Bell,
  Layers
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div 
    className={`p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary-main group-hover:scale-110 transition-transform duration-300 mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time GPS Tracking",
      description: "Track field executives live on the map with sub-meter accuracy and status updates.",
      delay: 0
    },
    {
      icon: ClipboardList,
      title: "Store Visit Monitoring",
      description: "Monitor visits, outcomes, and follow-ups with automated check-ins and photo proofs.",
      delay: 100
    },
    {
      icon: Navigation,
      title: "Route Tracking & Analytics",
      description: "Analyze employee movement, optimized paths, and daily travel distance efficiency.",
      delay: 200
    },
    {
      icon: ShoppingCart,
      title: "Order Collection System",
      description: "Allow executives to collect digital orders directly from stores with inventory sync.",
      delay: 300
    },
    {
      icon: Building2,
      title: "Multi-Tenant Architecture",
      description: "Enterprise-grade isolation allowing multiple companies to use the platform independently.",
      delay: 400
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Get daily, weekly, and monthly performance insights with automated email reports.",
      delay: 500
    },
    {
      icon: Bell,
      title: "Notification System",
      description: "Real-time alerts for managers and employees regarding tasks, targets, and alerts.",
      delay: 600
    },
    {
      icon: Layers,
      title: "Modular Portals",
      description: "Dedicated interfaces for Super Admins, Tenants, Managers, and Field Executives.",
      delay: 700
    }
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Platform Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Everything you need to manage your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-indigo-500">
              field force at scale
            </span>
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed pt-2">
            TrackForce provides a comprehensive suite of tools designed to optimize field operations, 
            increase transparency, and drive better business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
