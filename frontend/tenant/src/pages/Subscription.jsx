import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Zap, Shield, Crown, RefreshCw, AlertCircle, Sparkles, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getSubscription, updateSubscription, getAvailablePlans } from '../services/core/tenantService';

// Icon mapping for dynamic plans
const ICON_MAP = {
  Zap: Zap,
  Shield: Shield,
  Crown: Crown,
  Sparkles: Sparkles,
};

const STATUS_STYLES = {
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Active' },
  trial: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'Trial' },
  expired: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Expired' },
  inactive: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: 'Inactive' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const Subscription = () => {
  const { setPageLoading } = useOutletContext();
  const [data, setData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newCard, setNewCard] = useState({ brand: 'VISA', last4: '' });
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [subResult, plansResult] = await Promise.all([
        getSubscription(),
        getAvailablePlans()
      ]);
      setData(subResult);
      setAvailablePlans(plansResult);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load subscription details.');
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!newCard.last4 || newCard.last4.length !== 4) {
       setError('Please enter a valid 4-digit card ending.');
       setTimeout(() => setError(''), 4000);
       return;
    }
    
    try {
      setIsUpdatingPayment(true);
      await updateSubscription({
         paymentMethod: {
           brand: newCard.brand,
           last4: newCard.last4
         }
      });
      await fetchData();
      setSuccessMsg('✅ Payment method updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      setShowPaymentModal(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update payment method.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleSelectPlan = async (plan) => {
    const planName = plan.name;
    const currentPlan = data?.subscription?.plan || 'Free';
    if (planName === currentPlan) return;

    try {
      setUpgrading(planName);
      setSuccessMsg('');
      setError('');

      const now = new Date();
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      await updateSubscription({
        plan: planName,
        status: 'active', // Switching plans activates it
        price: plan.price,
        startDate: now.toISOString(),
        nextBillingDate: plan.price > 0 ? nextBilling.toISOString() : null,
        employeeLimit: plan.employeeLimit,
        features: plan.features,
        // Push a billing record only if it's a paid plan
        ...(Number(plan.price) > 0 && {
          billingEntry: {
            amount: Number(plan.price),
            date: now.toISOString(),
            description: `${planName} Plan — ${now.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
            status: 'paid',
          },
        }),
      });

      await fetchData();
      setSuccessMsg(`✅ Successfully switched to ${planName} plan!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setUpgrading(null);
    }
  };

  const subscription = data?.subscription || {};
  const currentPlan = subscription.plan || 'Free';
  const subStatus = subscription.status || 'trial';
  const employeeCount = data?.employeeCount ?? 0;
  const employeeLimit = subscription.employeeLimit ?? 5;
  const usagePercent = Math.min((employeeCount / employeeLimit) * 100, 100);

  // Find current plan details from available plans if possible
  const currentPlanDetails = availablePlans.find(p => p.name === currentPlan);
  const activeFeatures = subscription.features?.length
    ? subscription.features
    : currentPlanDetails?.features || [];

  const statusStyle = STATUS_STYLES[subStatus] || STATUS_STYLES.trial;


  if (error && !data) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
        <AlertCircle size={20} />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Subscription & Billing</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your plan, billing info, and resource limits.</p>
      </div>

      {/* Success / Error banners */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-700 dark:text-green-400 font-semibold text-sm">
          {successMsg}
        </div>
      )}
      {error && data && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 font-semibold text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Current Plan Card ── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />

            <div className="relative z-10">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                  Active Plan
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.label}
                </span>
              </div>

              <h2 className="text-4xl font-black mt-2">{currentPlan}</h2>
              <p className="text-indigo-100 font-bold mt-1">
                {Number(subscription.price) > 0 ? `$${subscription.price}.00 / Month` : 'Free Forever'}
              </p>

              {/* Usage bar */}
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-indigo-200">Next Billing</span>
                  <span>{formatDate(subscription.nextBillingDate)}</span>
                </div>
                {subscription.trialEndsAt && subStatus === 'trial' && (
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-yellow-300">Trial Ends</span>
                    <span className="text-yellow-300">{formatDate(subscription.trialEndsAt)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-indigo-200">Employees</span>
                  <span>{employeeCount} / {employeeLimit}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* Plan features from DB */}
              {activeFeatures.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">Included Features</p>
                  {activeFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-semibold text-indigo-100">
                      <Check size={13} className="text-white shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-1">
                {subscription.startDate && (
                  <p className="text-indigo-200 text-xs font-semibold">
                    Started: {formatDate(subscription.startDate)}
                  </p>
                )}
                <p className="text-indigo-200 text-xs font-semibold">
                  Company: {data?.company || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-gray-400" />
              Payment Method
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-indigo-600 rounded flex items-center justify-center text-[10px] text-white font-bold">
                  {subscription.paymentMethod?.brand || 'N/A'}
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {subscription.paymentMethod?.last4
                    ? `•••• ${subscription.paymentMethod.last4}`
                    : 'No card on file'}
                </p>
              </div>
              <button onClick={() => setShowPaymentModal(true)} className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
            </div>
          </div>

          {/* Billing History */}
          {subscription.billingHistory?.length > 0 && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest">Billing History</h3>
              <div className="space-y-3">
                {subscription.billingHistory.slice().reverse().slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{entry.description || 'Payment'}</p>
                      <p className="text-xs text-gray-400">{formatDate(entry.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 dark:text-white">${entry.amount}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${entry.status === 'paid' ? 'bg-green-100 text-green-700' :
                          entry.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: All Dynamic Plan Options ── */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availablePlans.map((plan, i) => {
            const isCurrentPlan = currentPlan === plan.name;
            const isLoading = upgrading === plan.name;
            const Icon = ICON_MAP[plan.icon] || Zap;
            const planColor = plan.color || 'blue';

            return (
              <div
                key={i}
                className={`p-7 rounded-3xl border flex flex-col relative overflow-hidden transition-all duration-300
                  ${isCurrentPlan
                    ? `border-${planColor}-500 ring-4 ring-${planColor}-50 dark:ring-${planColor}-900/20 bg-white dark:bg-gray-900 shadow-xl`
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md'
                  }`}
              >
                {/* Current badge */}
                {isCurrentPlan && (
                  <div className={`absolute top-4 right-4 bg-${planColor}-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full`}>
                    Current
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5
                  ${isCurrentPlan ? `bg-${planColor}-600 text-white shadow-lg` : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-1 mb-6">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    {Number(plan.price) === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {Number(plan.price) > 0 && <span className="text-gray-400 font-bold text-sm mb-1">/mo</span>}
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} className="text-indigo-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrentPlan || !!upgrading}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full mt-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2
                    ${isCurrentPlan
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default'
                      : upgrading
                        ? 'bg-indigo-300 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none'
                    }`}
                >
                  {isLoading && <RefreshCw size={14} className="animate-spin" />}
                  {isCurrentPlan ? 'Current Plan' : isLoading ? 'Updating...' : `Switch to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Update Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdatePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Card Brand</label>
                <select 
                  value={newCard.brand} 
                  onChange={(e) => setNewCard({...newCard, brand: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                >
                  <option value="VISA">VISA</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">Amex</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Last 4 Digits</label>
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="1234"
                  value={newCard.last4}
                  onChange={(e) => setNewCard({...newCard, last4: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="pt-4 flex gap-3 flex-col sm:flex-row">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)} 
                  className="w-full py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdatingPayment}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                >
                  {isUpdatingPayment ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
