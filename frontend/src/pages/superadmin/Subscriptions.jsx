import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Plus, 
  Edit2, 
  Trash2, 
  Zap, 
  Shield, 
  Crown,
  Users,
  Settings,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/Button';

const Subscriptions = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Basic',
      price: '49',
      interval: 'month',
      description: 'Ideal for small startups or local agencies.',
      features: ['Up to 10 Employees', 'Basic GPS Tracking', 'Daily Reports', 'Email Support'],
      active: true,
      popular: false,
      icon: Zap,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Premium',
      price: '149',
      interval: 'month',
      description: 'Best for growing businesses with multiple teams.',
      features: ['Up to 50 Employees', 'Real-time Tracking', 'Advanced Analytics', 'Priority Support', 'Geo-fencing'],
      active: true,
      popular: true,
      icon: Shield,
      color: 'indigo'
    },
    {
      id: 3,
      name: 'Enterprise',
      price: '499',
      interval: 'month',
      description: 'Full-featured solution for large organizations.',
      features: ['Unlimited Employees', 'White-labeling', 'API Access', 'Dedicated Manager', 'Custom Integration'],
      active: true,
      popular: false,
      icon: Crown,
      color: 'purple'
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Subscription Plans</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage platform pricing, feature limits, and subscription tiers.</p>
        </div>
        <Button variant="primary" className="rounded-2xl py-3 px-6 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2">
          <Plus size={18} />
          <span className="font-bold">Create New Plan</span>
        </Button>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 ${
              plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-100 dark:shadow-none' : 'border-gray-100 dark:border-gray-800'
            } p-8 transition-all duration-300 hover:translate-y-[-4px] group`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-${plan.color}-50 dark:bg-${plan.color}-500/10 text-${plan.color}-600 dark:text-${plan.color}-400`}>
                <plan.icon size={24} />
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              {plan.description}
            </p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-gray-900 dark:text-white">${plan.price}</span>
              <span className="text-gray-400 font-bold text-sm">/{plan.interval}</span>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              variant={plan.popular ? 'primary' : 'outline'} 
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group/btn"
            >
              Manage Tier
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total MRR', value: '$12,450', change: '+12%', icon: CreditCard, color: 'blue' },
          { label: 'Active Subscriptions', value: '142', change: '+5%', icon: Users, color: 'indigo' },
          { label: 'Avg. Retention', value: '98.2%', change: '+0.4%', icon: Settings, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon size={20} />
              </div>
              <span className="text-emerald-500 text-xs font-black">{stat.change}</span>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
