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
      icon: Building2,
      title: "Set Targets",
      description: "Define daily key performance indicators and assign store clusters to your field reps."
    },
    {
      number: 2,
      icon: Users,
      title: "Deploy Team",
      description: "Dispatch your executives and watch as they sync their schedules on the mobile app."
    },
    {
      number: 3,
      icon: MapPin,
      title: "Monitor Live",
      description: "Use the live map to track their real-time movements and verify check-ins instantly."
    },
    {
      number: 4,
      icon: BarChart3,
      title: "Analyze & Optimize",
      description: "Review daily closing reports, revenue generated, and optimize routes for tomorrow."
    }
  ];

  return (
    <section id="workflow" className="py-24 lg:py-32 bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-black text-primary-main uppercase tracking-[0.2em]">Operational Workflow</h2>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Seamless Team Oversight
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            From allocating sectors to driving conversions, TrackForce puts the control completely in your hands.
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
