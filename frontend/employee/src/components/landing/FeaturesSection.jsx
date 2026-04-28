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
      title: "Live Duty Tracking",
      description: "Start your shift and safely share your location with your manager effortlessly.",
      delay: 0
    },
    {
      icon: ClipboardList,
      title: "Seamless Check-Ins",
      description: "Easily check into locations, upload evidence photos, and complete forms.",
      delay: 100
    },
    {
      icon: Bell,
      title: "Task Notifications",
      description: "Never miss a beat with real-time alerts for assigned tasks and reminders.",
      delay: 200
    },
    {
      icon: ShoppingCart,
      title: "Quick Order Capture",
      description: "Submit digital orders with ease during your store visits using our intuitive UI.",
      delay: 300
    },
    {
      icon: Building2,
      title: "Merchant Intel",
      description: "Access historical data of merchants and suppliers before you even step in.",
      delay: 400
    },
    {
      icon: BarChart3,
      title: "My Analytics",
      description: "View your personal targets, compliance stats, and daily earnings directly.",
      delay: 500
    },
    {
      icon: Navigation,
      title: "Smart Routing",
      description: "Get the fastest navigation routes right to your designated store clusters.",
      delay: 600
    },
    {
      icon: Layers,
      title: "Offline Mode",
      description: "Loss of signal? Keep logging visits and they'll sync when you're back online.",
      delay: 700
    }
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Field Toolkit</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Everything you need to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-indigo-500">
              crush your daily targets
            </span>
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed pt-2">
            The Employee Portal is designed to make your day smoother. From check-ins to mapping out your routing path, your digital assistant has your back.
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
