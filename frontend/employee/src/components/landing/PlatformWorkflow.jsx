import React from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

const WorkflowStep = ({ number, icon: Icon, title, description }) => (
  <div className="flex-1 flex flex-col items-center text-center group relative px-8">
    <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-primary-main shadow-xl border border-gray-100 dark:border-gray-800 mb-6 group-hover:scale-110 group-hover:bg-primary-main group-hover:text-white transition-all duration-500 z-10">
      <Icon size={28} />
    </div>
    <div className="absolute top-8 left-[calc(50%+2rem)] w-full h-px bg-dashed bg-gray-200 dark:bg-gray-800 hidden lg:block -z-0" 
         style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 50%, transparent 50%)', backgroundSize: '12px 1px', backgroundRepeat: 'repeat-x' }} />
    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
      <span className="text-primary-main mr-2 font-black">0{number}.</span>
      {title}
    </h4>
    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

const PlatformWorkflow = () => {
  const steps = [
    {
      number: 1,
      icon: Users,
      title: "Receive Tasks",
      description: "Start your day by reviewing tasks and store visits assigned securely by your manager."
    },
    {
      number: 2,
      icon: MapPin,
      title: "Navigate & Track",
      description: "Activate your shift. We will guide you efficiently to your destination while sharing live ETA."
    },
    {
      number: 3,
      icon: Building2,
      title: "Execute Visit",
      description: "Check into the location, snap evidence, log your interactions and submit any new orders."
    },
    {
      number: 4,
      icon: BarChart3,
      title: "Review Metrics",
      description: "Check your personal dashboard to see how your day's work boosts your performance stats."
    }
  ];

  return (
    <section id="workflow" className="py-24 lg:py-32 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Your Shift Journey</h2>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            How Your Day Works
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            TrackForce simplifies your daily field routines, ensuring you can focus entirely on achieving targets.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row space-y-12 lg:space-y-0 relative">
          {steps.map((step, index) => (
            <WorkflowStep key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformWorkflow;
