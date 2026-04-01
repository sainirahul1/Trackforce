import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Building2,
  X,
  Target,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import superadminService from '../../services/superadmin/superadminService';
import { useDialog } from '../../context/DialogContext';

const Subscriptions = () => {
  const { showAlert, showConfirm } = useDialog();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    mrr: '$0',
    totalTenants: '0',
    activeSubscribers: '0',
    retention: '0%'
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [subFormData, setSubFormData] = useState({
    name: '',
    price: '',
    interval: 'month',
    description: '',
    features: [''],
    employeeLimit: 50,
    isPopular: false,
    icon: 'Zap',
    color: 'blue'
  });

  const iconMap = { Zap, Shield, Crown };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansData, statsData] = await Promise.all([
        superadminService.getSubscriptions(),
        superadminService.getAnalyticsStats()
      ]);
      setPlans(plansData);
      setStats({
        mrr: `$${statsData.totalMRR.toLocaleString()}`,
        totalTenants: statsData.totalTenants.toString(),
        activeSubscribers: statsData.totalTenants.toString(),
        retention: '98.5%' // Mocked for now
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const cleanedData = {
        ...subFormData,
        features: subFormData.features.filter(f => f.trim() !== '')
      };

      if (isEditing && selectedPlanId) {
        await superadminService.updateSubscription(selectedPlanId, cleanedData);
      } else {
        await superadminService.createSubscription(cleanedData);
      }

      handleCloseModal();
      fetchData();
      showAlert('Subscription plan saved successfully.', 'Plan Saved', 'success');
    } catch (error) {
      console.error('Error saving plan:', error);
      showAlert('Failed to save plan: ' + (error.response?.data?.message || error.message), 'Save Failed', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditClick = (plan) => {
    setSubFormData({
      name: plan.name,
      price: plan.price.toString(),
      interval: plan.interval,
      description: plan.description,
      features: plan.features.length ? plan.features : [''],
      employeeLimit: plan.employeeLimit,
      isPopular: plan.isPopular,
      icon: plan.icon || 'Zap',
      color: plan.color || 'blue'
    });
    setSelectedPlanId(plan._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeletePlan = async (id) => {
    const confirmed = await showConfirm('Are you sure you want to delete this subscription plan? This action cannot be undone.', 'Delete Plan', 'danger');
    if (confirmed) {
      try {
        await superadminService.deleteSubscription(id);
        fetchData();
        showAlert('Plan deleted successfully', 'Deleted', 'success');
      } catch (error) {
        console.error('Error deleting plan:', error);
        showAlert('Failed to delete plan: ' + error.message, 'Delete Error', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedPlanId(null);
    setSubFormData({
      name: '',
      price: '',
      interval: 'month',
      description: '',
      features: [''],
      employeeLimit: 50,
      isPopular: false,
      icon: 'Zap',
      color: 'blue'
    });
  };

  const addFeature = () => {
    setSubFormData({ ...subFormData, features: [...subFormData.features, ''] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...subFormData.features];
    newFeatures[index] = value;
    setSubFormData({ ...subFormData, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = subFormData.features.filter((_, i) => i !== index);
    setSubFormData({ ...subFormData, features: newFeatures.length ? newFeatures : [''] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total MRR', value: stats.mrr, change: '+12%', icon: CreditCard, color: 'blue' },
          { label: 'Total Tenants', value: stats.totalTenants, icon: Building2, color: 'indigo' },
          { label: 'Active Subs', value: stats.activeSubscribers, icon: Users, color: 'purple' },
          { label: 'Avg. Retention', value: stats.retention, change: '+0.4%', icon: Settings, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5 transition-transform">
            {loading ? (
              <>
                <Skeleton variant="rounded" className="w-14 h-14" />
                <div className="space-y-2 flex-grow">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-2/5" />
                    <Skeleton className="h-3 w-1/5 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </>
            ) : (
              <>
                <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 flex-shrink-0`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate">{stat.label}</p>
                    {stat.change && <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded border border-emerald-100 dark:border-emerald-800">{stat.change}</span>}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</h3>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-72 uppercase tracking-tight" />
            <Skeleton className="h-4 w-[32rem] font-medium" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Subscription Plans</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage platform pricing, feature limits, and subscription tiers.</p>
          </div>
        )}
        {loading ? (
          <Skeleton className="h-12 w-52 rounded-2xl" />
        ) : (
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="rounded-2xl py-3 px-6 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="font-bold">Create New Plan</span>
          </Button>
        )}
      </div>


      {/* Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-800 p-8 space-y-6">
              <div className="flex justify-between items-start">
                <Skeleton variant="rounded" className="w-14 h-14" />
                <div className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="w-8 h-8 rounded-xl" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-10 w-1/2" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-800/10 ${plan.isPopular ? 'border-indigo-900' : 'border-gray-100 dark:border-gray-800 hover:border-indigo-900 dark:hover:border-indigo-900'
                } p-8 group`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {(() => {
                    const IconComp = iconMap[plan.icon] || Zap;
                    return <IconComp size={24} />;
                  })()}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {/* <Edit2 size={16} /> */}
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan._id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                  >
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
                variant={plan.isPopular ? 'primary' : 'outline'}
                onClick={() => handleEditClick(plan)}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group/btn"
              >
                Manage Tier
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={handleCloseModal}
          />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSubmitPlan}>
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {isEditing ? 'Update Plan' : 'New Subscription Tier'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isEditing ? `Modifying ${subFormData.name} parameters` : 'Define platform features and pricing'}
                  </p>
                </div>
                <button type="button" onClick={handleCloseModal} className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-2xl text-gray-400 transition-colors shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plan Name</label>
                    <input
                      required
                      value={subFormData.name}
                      onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })}
                      placeholder="e.g. Professional"
                      className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none ring-offset-white dark:ring-offset-gray-900 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        required
                        value={subFormData.price}
                        onChange={(e) => setSubFormData({ ...subFormData, price: e.target.value })}
                        placeholder="49"
                        className="w-full pl-8 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none ring-offset-white dark:ring-offset-gray-900 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Billing Interval</label>
                    <select
                      value={subFormData.interval}
                      onChange={(e) => setSubFormData({ ...subFormData, interval: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer ring-offset-white dark:ring-offset-gray-900 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">User Limit</label>
                    <input
                      required
                      type="number"
                      value={subFormData.employeeLimit}
                      onChange={(e) => setSubFormData({ ...subFormData, employeeLimit: parseInt(e.target.value) })}
                      placeholder="50"
                      className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none ring-offset-white dark:ring-offset-gray-900 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Description</label>
                  <textarea
                    required
                    rows="2"
                    value={subFormData.description}
                    onChange={(e) => setSubFormData({ ...subFormData, description: e.target.value })}
                    placeholder="Perfect for growing teams..."
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none ring-offset-white dark:ring-offset-gray-900 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Features</label>
                    <button type="button" onClick={addFeature} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Add Feature</button>
                  </div>
                  <div className="space-y-2">
                    {subFormData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder={`Feature #${index + 1}`}
                          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl text-xs font-bold outline-none"
                        />
                        <button type="button" onClick={() => removeFeature(index)} className="p-3 bg-gray-50 dark:bg-gray-800/50 text-gray-400 hover:text-rose-500 rounded-xl">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-2xl border border-indigo-50 dark:border-indigo-500/10">
                  <div className="flex-1">
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Highlight as Popular</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Will display a badge and highlight the card</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubFormData({ ...subFormData, isPopular: !subFormData.isPopular })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${subFormData.isPopular ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${subFormData.isPopular ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 flex gap-3 border-t border-gray-50 dark:border-gray-800">
                <Button type="button" onClick={handleCloseModal} variant="outline" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-gray-200">
                  Cancel
                </Button>
                <Button disabled={isCreating} variant="primary" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none">
                  {isCreating ? 'Processing...' : (isEditing ? 'Save Changes' : 'Launch Tier')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Subscriptions;
