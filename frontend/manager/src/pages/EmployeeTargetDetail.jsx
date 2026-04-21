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
        <div className="max-w-[1400px] mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Header Module */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                <button 
                  onClick={() => navigate('/manager/targets')} 
                  className="group flex items-center gap-6 text-gray-500 hover:text-blue-600 transition-all w-fit"
                >
                    <div className="w-14 h-14 rounded-[1.2rem] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-blue-500/10 transition-all">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <div className="text-left">
                        <span className="font-black text-[10px] tracking-[0.4em] uppercase block leading-none mb-2 italic">Sector Return</span>
                        <span className="text-[13px] font-black text-gray-400 uppercase tracking-tighter">Personnel Distribution Hub</span>
                    </div>
                </button>

                <div className="flex items-center gap-10 bg-white/50 dark:bg-gray-950/50 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white dark:border-gray-800 shadow-xl pr-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                    <div className="w-20 h-20 rounded-[1.8rem] bg-gray-950 dark:bg-white p-1 border-[6px] border-white dark:border-gray-900 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 relative z-10">
                        <img src={`https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} className="w-full h-full object-cover rounded-[1.2rem]" />
                    </div>
                    <div className="text-left relative z-10">
                        <h1 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic leading-none mb-2">{employee.name}</h1>
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic">Strategic Operative</p>
                           <span className="text-gray-300">|</span>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">{employee.designation} • {employee.zone}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white dark:border-gray-800 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.08)] transition-all hover:shadow-2xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[1.2rem] group-hover:rotate-12 transition-transform shadow-inner">
                            <Target size={28} />
                        </div>
                        <div className="text-right">
                           <span className="text-[24px] font-black text-blue-600 italic tracking-tighter shadow-blue-500/10">/{employee.currentDailyTarget || 0}</span>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mt-1">Strategic Quota</p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-6xl font-black text-gray-950 dark:text-white tracking-tighter italic leading-none mb-1">{employee.achieved}</h3>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-0">Current Mission Intel</p>
                    </div>
                </div>

                <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white dark:border-gray-800 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.08)] transition-all hover:shadow-2xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[1.2rem] group-hover:scale-110 transition-transform shadow-inner">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Achievement Rate</p>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Real-Time Efficiency</p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-6xl font-black text-gray-950 dark:text-white tracking-tighter italic leading-none mb-1">
                            {employee.currentDailyTarget > 0 ? Math.round((employee.achieved / employee.currentDailyTarget) * 100) : 0}%
                        </h3>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Deployment Integrity</p>
                    </div>
                </div>

                <div className="bg-gray-950 dark:bg-black p-10 rounded-[3.5rem] border border-white/10 shadow-2xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[100px] -mr-24 -mt-24 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="p-4 bg-white/10 text-white rounded-[1.2rem] group-hover:rotate-[20deg] transition-transform shadow-inner">
                            <Activity size={28} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] italic">Protocol Status</p>
                           <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 italic">Active Oversight</p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h3 className={`text-6xl font-black tracking-tighter italic leading-none mb-1 ${employee.achieved >= employee.currentDailyTarget ? 'text-emerald-500' : 'text-white'}`}>
                            {employee.achieved >= employee.currentDailyTarget ? 'CLEARED' : 'ENGAGED'}
                        </h3>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Mission Operating Mode</p>
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
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
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
                    <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl rounded-[3.5rem] border border-white dark:border-gray-800 overflow-hidden shadow-[0_30px_100px_-30px_rgba(0,0,0,0.08)]">
                        <div className="p-10 border-b border-gray-50 dark:border-gray-900/50 flex items-center justify-between">
                            <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                                <History size={20} className="text-blue-600" />
                                Operational Timeline Log
                            </h3>
                            <span className="px-6 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest italic shadow-inner">Full Audit Ledger</span>
                        </div>
                        <div className="p-6 space-y-3">
                            {history.length > 0 ? history.map((log, idx) => (
                                <div key={idx} className="p-8 transition-all hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-[2.5rem] flex items-center justify-between group border border-transparent hover:shadow-2xl">
                                    <div className="flex items-center gap-10">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-950 dark:bg-white flex flex-col items-center justify-center text-white dark:text-gray-950 font-black relative overflow-hidden group-hover:rotate-6 transition-all shadow-2xl">
                                            <span className="text-[10px] leading-none mb-1 uppercase tracking-tighter italic">{new Date(log.date).toLocaleDateString('default', { month: 'short' })}</span>
                                            <span className="text-2xl leading-none font-black italic">{new Date(log.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-950 dark:text-white tracking-tighter uppercase text-[15px] mb-3 italic">Sector Objective Resolution</h4>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white dark:bg-gray-950 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm transition-all group-hover:scale-105">
                                                    <Target size={14} className="text-blue-600" />
                                                    <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest italic">{log.monthlyTarget} Quota</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white dark:bg-gray-950 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm transition-all group-hover:scale-105">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest italic">{log.achieved} Cleared</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right pr-6">
                                        <p className={`text-4xl font-black ${log.percent >= 100 ? 'text-emerald-500' : 'text-amber-500'} tracking-tighter leading-none mb-2 italic shadow-current/10`}>{log.percent}%</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Mission Efficiency</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-32 text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto text-gray-300 shadow-inner">
                                        <Clock size={48} />
                                    </div>
                                    <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[11px] italic">Strategic mission ledger empty</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right: Target Assignment Form */}
                <div className="space-y-8">
                    <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white dark:border-gray-800 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)] space-y-10 sticky top-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                        <div className="relative overflow-hidden p-8 bg-gray-950 dark:bg-black rounded-[2.5rem] text-white shadow-2xl mb-4 group border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-3">
                                <h3 className="text-2xl font-black tracking-tighter leading-none uppercase italic">Strategic Hub</h3>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic">Tactical Mission Distribution</p>
                            </div>
                        </div>

                        <form onSubmit={handleSetTarget} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-6 italic">Deployment Phase</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-16 pr-8 py-5 bg-gray-50/50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[2rem] outline-none font-black text-[13px] transition-all shadow-inner uppercase tracking-widest italic text-gray-950 dark:text-white"
                                        value={newTarget.date}
                                        onChange={(e) => setNewTarget({ ...newTarget, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-6 italic">Personnel Quota</label>
                                <div className="relative group">
                                    <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="TARGET LOGS..."
                                        className="w-full pl-16 pr-8 py-6 bg-gray-50/50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[2rem] outline-none font-black text-2xl text-gray-950 dark:text-white transition-all shadow-inner italic"
                                        value={newTarget.dailyTarget}
                                        onChange={(e) => setNewTarget({ ...newTarget, dailyTarget: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-6 italic">Mission Briefing</label>
                                <textarea
                                    placeholder="ENTER OPERATIONAL PARAMETERS..."
                                    className="w-full px-8 py-6 bg-gray-50/50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[2rem] outline-none font-bold text-[13px] transition-all min-h-[150px] shadow-inner dark:text-white placeholder:text-gray-400 uppercase tracking-widest italic"
                                    value={newTarget.note}
                                    onChange={(e) => setNewTarget({ ...newTarget, note: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-6 rounded-[2rem] bg-gray-950 dark:bg-white text-white dark:text-gray-950 font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all italic border-none"
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-4">
                                        <Loader2 size={18} className="animate-spin" />
                                        Syncing Intelligence...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-4">
                                        Assign Tactical Phase
                                        <ChevronRight size={20} />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/20 flex gap-5 relative z-10">
                            <Info size={24} className="text-blue-500 shrink-0 mt-1" />
                            <p className="text-[10px] font-black text-blue-600/80 leading-relaxed uppercase tracking-[0.2em] italic">
                                Overwriting existing mission parameters for the selected phase will reset all localized telemetry counters.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeTargetDetail;
