import React from 'react';
import { CreditCard, Check, Zap, Shield, Crown, RefreshCw } from 'lucide-react';

const Subscription = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Subscription & Billing</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your plan, billing info, and resource limits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
            <Zap className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
            <div className="relative z-10">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">Active Plan</span>
              <h2 className="text-4xl font-black mt-4">Enterprise</h2>
              <p className="text-indigo-100 font-bold mt-1">$499.00 / Month</p>
              
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-indigo-200">Next Billing</span>
                  <span>April 18, 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-indigo-200">Employees</span>
                  <span>142 / 500</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-2">
                  <div className="w-[30%] h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-white text-indigo-600 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-xl">
                Manage Billing
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-gray-400" />
              Payment Method
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-indigo-600 rounded flex items-center justify-center text-[10px] text-white font-bold">VISA</div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">•••• 4242</p>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
            </div>
          </div>
        </div>

        {/* Plan Options */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Pro', price: '$199', icon: Shield, features: ['Up to 100 Employees', 'Unlimited Live Tracking', 'Daily Reports', 'Advanced Analytics'], current: false },
            { name: 'Enterprise', price: '$499', icon: Crown, features: ['Unlimited Employees', 'Route Optimization', 'Custom Branding', 'API Access', '24/7 Support'], current: true },
          ].map((plan, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${plan.current ? 'border-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/10' : 'border-gray-100 dark:border-gray-800'} bg-white dark:bg-gray-900 flex flex-col relative overflow-hidden`}>
              {plan.current && <div className="absolute top-4 right-4"><Check className="text-indigo-600" /></div>}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.current ? 'bg-indigo-600 text-white shadow-xl' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                <plan.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-400 font-bold text-sm mb-1.5">/month</span>
              </div>
              
              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-indigo-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full mt-10 py-4 rounded-2xl font-black transition-all ${
                plan.current 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none'
              }`}>
                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
