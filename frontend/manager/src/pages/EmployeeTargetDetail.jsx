import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
    ArrowLeft, Target, TrendingUp, History, Calendar,
    CheckCircle2, Activity, Clock, Loader2, ChevronRight,
    Search, Info, AlertCircle, BarChart3, User, Zap
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
        <div className="max-w-[1400px] mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button 
                  onClick={() => navigate('/manager/targets')} 
                  className="group flex items-center gap-4 text-gray-500 hover:text-indigo-600 transition-all w-fit"
                >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-lg flex items-center justify-center group-hover:scale-110 transition-all">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <div className="text-left">
                        <span className="font-black text-[8px] tracking-[0.3em] uppercase block leading-none mb-1 opacity-50">Sector Return</span>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">Personnel Hub</span>
                    </div>
                </button>

                <div className="flex items-center gap-6 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl p-4 rounded-3xl border border-white dark:border-gray-800 shadow-lg relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-gray-900 dark:bg-white p-0.5 border-4 border-white dark:border-gray-900 shadow-xl relative z-10">
                        <img src={`https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="text-left relative z-10">
                        <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tighter uppercase leading-none mb-1">{employee.name}</h1>
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">{employee.designation} • {employee.zone}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Current Achievement', value: employee.achieved, sub: `Quota: ${employee.currentDailyTarget || 0}`, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { label: 'Mission Efficiency', value: `${employee.currentDailyTarget > 0 ? Math.round((employee.achieved / employee.currentDailyTarget) * 100) : 0}%`, sub: 'Real-Time Sync', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Protocol Status', value: employee.achieved >= employee.currentDailyTarget ? 'CLEARED' : 'ENGAGED', sub: 'Active Oversight', icon: Activity, color: employee.achieved >= employee.currentDailyTarget ? 'text-emerald-500' : 'text-indigo-500', bg: 'bg-gray-900 dark:bg-white/10', dark: true }
                ].map((stat, i) => (
                    <div key={i} className={`${stat.dark ? 'bg-gray-950 text-white' : 'bg-white dark:bg-gray-900'} p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-lg group relative overflow-hidden`}>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className={`text-3xl font-black tracking-tighter leading-none mb-1 ${stat.dark ? 'text-white' : 'text-gray-950 dark:text-white'}`}>{stat.value}</h3>
                            <p className="text-[9px] font-black opacity-50 uppercase tracking-[0.3em]">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Charts & History */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Performance Chart */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                    Strategic Analysis
                                    <BarChart3 size={16} className="text-indigo-500" />
                                </h3>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">14-Day Deployment Window</p>
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'black' }}
                                    />
                                    <Area type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTarget)" />
                                    <Area type="monotone" dataKey="achieved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAchieved)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <History size={16} className="text-indigo-600" />
                                Deployment Timeline
                            </h3>
                            <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest">Audit Ledger</span>
                        </div>
                        <div className="p-4 space-y-2">
                            {history.length > 0 ? history.map((log, idx) => (
                                <div key={idx} className="p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl flex items-center justify-between group border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-gray-950 dark:bg-white flex flex-col items-center justify-center text-white dark:text-gray-950 font-black shadow-lg">
                                            <span className="text-[8px] uppercase tracking-tighter">{new Date(log.date).toLocaleDateString('default', { month: 'short' })}</span>
                                            <span className="text-lg leading-none">{new Date(log.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-950 dark:text-white tracking-tighter uppercase text-xs mb-2">Sector Objective</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                    <Target size={10} className="text-indigo-600" /> {log.monthlyTarget}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                    <CheckCircle2 size={10} className="text-emerald-500" /> {log.achieved}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-black ${log.percent >= 100 ? 'text-emerald-500' : 'text-indigo-600'} tracking-tighter leading-none mb-1`}>{log.percent}%</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Efficiency</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <Clock size={32} className="mx-auto text-gray-200" />
                                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[9px]">Mission ledger empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Target Assignment Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl sticky top-8">
                        <div className="p-6 bg-gray-950 rounded-2xl text-white shadow-xl mb-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-150 transition-transform duration-1000"><Zap size={80} className="text-indigo-400" /></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black tracking-tighter uppercase mb-1">Strategic Hub</h3>
                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">Mission Distribution</p>
                            </div>
                        </div>

                        <form onSubmit={handleSetTarget} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-4">Deployment Phase</label>
                                <div className="relative">
                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-black text-[11px] uppercase tracking-widest dark:text-white"
                                        value={newTarget.date}
                                        onChange={(e) => setNewTarget({ ...newTarget, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-4">Personnel Quota</label>
                                <div className="relative">
                                    <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="TARGET LOGS..."
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-black text-xl text-gray-950 dark:text-white"
                                        value={newTarget.dailyTarget}
                                        onChange={(e) => setNewTarget({ ...newTarget, dailyTarget: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-4">Mission Briefing</label>
                                <textarea
                                    placeholder="OPERATIONAL PARAMETERS..."
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold text-[11px] min-h-[120px] dark:text-white uppercase tracking-widest placeholder:text-gray-400"
                                    value={newTarget.note}
                                    onChange={(e) => setNewTarget({ ...newTarget, note: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all border-none"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Assign Tactical Phase'}
                            </Button>
                        </form>

                        <div className="mt-8 p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex gap-4">
                            <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-[8px] font-black text-indigo-600/80 leading-relaxed uppercase tracking-[0.15em]">
                                Deploying new mission parameters will synchronize existing localized telemetry.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeTargetDetail;
