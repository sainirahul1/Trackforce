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
      title: "Live Command Center",
      description: "Watch your entire team move across the map in real-time with sub-meter accuracy.",
      delay: 0
    },
    {
      icon: Navigation,
      title: "Route Compliance",
      description: "Verify that daily routes are optimized and executives are tracking their kilometers honestly.",
      delay: 100
    },
    {
      icon: BarChart3,
      title: "Revenue Intelligence",
      description: "Monitor live order collections, conversions, and revenue generation from the field.",
      delay: 200
    },
    {
      icon: Building2,
      title: "Territory Allocation",
      description: "Draw maps and assign specific sectors or store clusters directly to your team members.",
      delay: 300
    },
    {
      icon: ClipboardList,
      title: "Automated Approvals",
      description: "Review geo-fenced check-ins and photo proofs directly from the dashboard.",
      delay: 400
    },
    {
      icon: ShoppingCart,
      title: "Inventory Oversight",
      description: "Track inventory orders submitted by field reps and synchronize with the warehouse.",
      delay: 500
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get instantly notified when targets are met, routes deviate, or missions are completed.",
      delay: 600
    },
    {
      icon: Layers,
      title: "Advanced Reports",
      description: "Generate deep-dive analytics on employee efficiency and historical performance.",
      delay: 700
    }
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Management Toolkit</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Total Visibility into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-indigo-500">
              Your Operartions
            </span>
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed pt-2">
            The Manager Command Center gives you the tools to monitor team movement, verify execution, and analyze revenue effortlessly.
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
