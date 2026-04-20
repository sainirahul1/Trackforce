import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, Target, TrendingUp, History, Calendar, 
  CheckCircle2, Activity, Clock, Loader2, ChevronRight, 
  Search, Info, AlertCircle, BarChart3, User
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import apiClient from '../services/apiClient';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';

const EmployeeTargetDetail = () => {
    const { setPageLoading } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useDialog();

    const [employee, setEmployee] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [newTarget, setNewTarget] = useState({
        dailyTarget: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        fetchEmployeeData();
    }, [id]);

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);
            if (setPageLoading) setPageLoading(true);
            
            // Fetch employee overview and history
            const [overviewRes, historyRes] = await Promise.all([
                apiClient.get('/reatchall/manager/targets/employees'),
                apiClient.get(`/reatchall/manager/targets/history/${id}`)
            ]);

            if (overviewRes.data.success) {
                const emp = overviewRes.data.data.find(e => e.id === id);
                setEmployee(emp);
                if (emp) {
                    setNewTarget(prev => ({ ...prev, dailyTarget: emp.currentDailyTarget || '' }));
                }
            }

            if (historyRes.data.success) {
                setHistory(historyRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showAlert('Error', 'Failed to load mission intelligence', 'error');
        } finally {
            setLoading(false);
            if (setPageLoading) setPageLoading(false);
        }
    };

    const handleSetTarget = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const response = await apiClient.post('/reatchall/manager/targets', {
                employeeId: id,
                ...newTarget
            });
            if (response.data.success) {
                showAlert('Success', 'Daily mission assigned successfully', 'success');
                fetchEmployeeData(); // Refresh everything
            }
        } catch (error) {
            console.error('Failed to set target:', error);
            showAlert('Error', 'Failed to synchronize mission parameters', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em] animate-pulse">Accessing Mission Log...</p>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-950 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl">
               <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
               <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Personnel Not Found</h2>
               <p className="text-gray-400 font-bold mt-2">The requested operative intelligence is unavailable.</p>
               <Button onClick={() => navigate('/manager/targets')} className="mt-8 rounded-2xl">Return to Fleet Command</Button>
            </div>
        );
    }

    // Chart Data Preparation
    const chartData = [...history].reverse().slice(-14).map(item => ({
        date: new Date(item.date).toLocaleDateString('default', { day: 'numeric', month: 'short' }),
        target: item.monthlyTarget,
        achieved: item.achieved,
        percent: item.percent
    }));

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button onClick={() => navigate('/manager/targets')} className="group flex items-center gap-3 text-gray-500 hover:text-indigo-600 transition-all">
                    <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group-hover:scale-110 transition-transform">
                        <ArrowLeft size={20} />
                    </div>
                    <div>
                        <span className="font-black text-[10px] tracking-[0.3em] uppercase block leading-none mb-1">Tactical Return</span>
                        <span className="text-xs font-bold text-gray-400">Fleet Operations Center</span>
                    </div>
                </button>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{employee.name}</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{employee.designation} • {employee.zone}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-900 p-1 border-2 border-white dark:border-gray-800 shadow-xl rotate-3">
                        <img src={`https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Today's Mission</h3>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{employee.achieved}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Logged Visits</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-indigo-600 tracking-tight">/ {employee.currentDailyTarget || 0}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Quota</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl group-hover:rotate-6 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Efficiency</h3>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {employee.currentDailyTarget > 0 ? Math.round((employee.achieved/employee.currentDailyTarget)*100) : 0}%
                        </p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Current Achievement</p>
                    </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-2xl -mr-8 -mt-8" />
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Duty Status</h3>
                    </div>
                    <div className="relative z-10">
                        <p className={`text-4xl font-black tracking-tighter uppercase ${employee.achieved >= employee.currentDailyTarget ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                            {employee.achieved >= employee.currentDailyTarget ? 'Success' : 'Active'}
                        </p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Operational Environment</p>
                    </div>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Charts & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Chart */}
                    <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                    Performance Analytics
                                    <BarChart3 size={18} className="text-indigo-500" />
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Last 14 Deployments</p>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                                        labelStyle={{ color: '#6366f1' }}
                                    />
                                    <Area type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTarget)" />
                                    <Area type="monotone" dataKey="achieved" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAchieved)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-8 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Strategic Target</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Achieved Visits</span>
                            </div>
                        </div>
                    </div>

                    {/* Success Rate Bar Chart */}
                    <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                    Mission Success Rate
                                    <TrendingUp size={18} className="text-emerald-500" />
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Completion % across latest logs</p>
                            </div>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                        cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                                    />
                                    <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.percent >= 100 ? '#10b981' : '#6366f1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Full History Log */}
                    <div className="bg-white/50 dark:bg-gray-800/20 backdrop-blur-xl rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-white/50 flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                <History size={16} />
                                Mission History Log
                            </h3>
                            <span className="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">Detailed Telemetry</span>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {history.length > 0 ? history.map((log, idx) => (
                                <div key={idx} className="p-6 transition-all hover:bg-white dark:hover:bg-gray-800 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-indigo-600 font-black relative overflow-hidden group-hover:border-indigo-200 transition-colors">
                                            <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-[9px] leading-none relative z-10">{new Date(log.date).toLocaleDateString('default', {month: 'short'}).toUpperCase()}</span>
                                            <span className="text-lg leading-none mt-1 relative z-10 font-black">{new Date(log.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white tracking-tight uppercase text-sm mb-1">Sector Objective</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                                                    <Target size={10} className="text-indigo-400" />
                                                    <span className="text-[10px] font-black text-gray-500">{log.monthlyTarget} Target</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                                                    <CheckCircle2 size={10} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black text-gray-500">{log.achieved} Done</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl font-black ${log.percent >= 100 ? 'text-emerald-500' : 'text-amber-500'} tracking-tighter leading-none mb-1`}>{log.percent}%</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Efficiency</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                        <Clock size={32} />
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No historical intelligence recorded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Target Assignment Form */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8 sticky top-8">
                        <div className="relative overflow-hidden p-6 bg-slate-900 dark:bg-indigo-950 rounded-[2rem] text-white shadow-xl mb-4 group border border-slate-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-2">
                                <h3 className="text-xl font-black tracking-tight leading-none uppercase">Generate Target</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tactical Mission Distribution</p>
                            </div>
                        </div>

                        <form onSubmit={handleSetTarget} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Deployment Date</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input 
                                        type="date"
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.8rem] outline-none font-bold text-sm transition-all shadow-inner"
                                        value={newTarget.date}
                                        onChange={(e) => setNewTarget({...newTarget, date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Visit Quota</label>
                                <div className="relative group">
                                    <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input 
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="Target visits count"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.8rem] outline-none font-black text-lg text-gray-900 dark:text-white transition-all shadow-inner"
                                        value={newTarget.dailyTarget}
                                        onChange={(e) => setNewTarget({...newTarget, dailyTarget: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Briefing Intelligence</label>
                                <textarea 
                                    placeholder="Add specialized operational instructions..."
                                    className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.8rem] outline-none font-bold text-sm transition-all min-h-[120px] shadow-inner"
                                    value={newTarget.note}
                                    onChange={(e) => setNewTarget({...newTarget, note: e.target.value})}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSaving}
                                className="w-full py-5 rounded-[1.8rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-200 dark:shadow-none animate-in fade-in duration-500"
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 size={16} className="animate-spin" />
                                        Syncing Mission...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        Assign Tactical Target
                                        <ChevronRight size={18} />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-800/50 flex gap-4">
                            <Info size={20} className="text-amber-500 shrink-0 mt-1" />
                            <p className="text-[10px] font-bold text-amber-600/80 leading-relaxed uppercase tracking-wider">
                                Assigning a new target for an existing date will overwrite the previous mission parameters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeTargetDetail;
