import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Target, Search, Loader2, ArrowRight, ArrowLeft, History, Calendar, 
  CheckCircle2, TrendingUp, ChevronRight, Activity, Clock, 
  Users, BarChart3, UserPlus, Filter, Grid, List as ListIcon,
  Zap, MapPin, ExternalLink, Edit2, Trash2
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';

const Targets = () => {
    const { setPageLoading } = useOutletContext();
    const navigate = useNavigate();
    const { showAlert } = useDialog();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    
    // Mission Deployment State
    const [selectedForAssign, setSelectedForAssign] = useState(null);
    const [quickTarget, setQuickTarget] = useState({
        dailyTarget: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [recentTransmissions, setRecentTransmissions] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            if (setPageLoading) setPageLoading(true);
            const response = await apiClient.get('/reatchall/manager/targets/employees');
            if (response.data.success) {
                const data = response.data.data;
                setEmployees(data);
                
                // Populate recent transmissions with anyone who has a target today
                const activeTargets = data
                    .filter(emp => emp.currentDailyTarget > 0)
                    .map(emp => ({
                        id: `T-${emp.id.slice(-4)}`,
                        name: emp.name,
                        target: emp.currentDailyTarget,
                        timestamp: 'Active Today',
                        status: 'Transmitted'
                    }));
                setRecentTransmissions(activeTargets.slice(0, 5));
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            showAlert('Error', 'Failed to load fleet intelligence', 'error');
        } finally {
            setLoading(false);
            if (setPageLoading) setPageLoading(false);
        }
    };

    const handleQuickAssign = async (e) => {
        if (e) e.preventDefault();
        if (!selectedForAssign || !quickTarget.dailyTarget) {
            showAlert('Wait', 'Please select an operative and define a target', 'warning');
            return;
        }

        try {
            setIsSaving(true);
            const response = await apiClient.post('/reatchall/manager/targets', {
                employeeId: selectedForAssign.id,
                ...quickTarget
            });
            if (response.data.success) {
                showAlert('Success', `Daily mission assigned to ${selectedForAssign.name}`, 'success');
                
                // Reset form
                setSelectedForAssign(null);
                setQuickTarget(prev => ({ ...prev, dailyTarget: '' }));
                
                fetchEmployees();
            }
        } catch (error) {
            showAlert('Error', 'Failed to synchronize mission parameters', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteTarget = async (targetId, empName) => {
        if (!window.confirm(`Are you sure you want to abort the mission for ${empName}?`)) return;
        
        try {
            const response = await apiClient.delete(`/reatchall/manager/targets/${targetId}`);
            if (response.data.success) {
                showAlert('Mission Aborted', `Target for ${empName} has been retracted.`, 'success');
                fetchEmployees();
            }
        } catch (error) {
            showAlert('Error', 'Failed to retract mission', 'error');
        }
    };

    const handleEditTarget = (log) => {
        const emp = employees.find(e => e.id === log.empId);
        if (emp) {
            setSelectedForAssign(emp);
            setQuickTarget({
                dailyTarget: log.target,
                date: new Date().toISOString().split('T')[0],
                note: ''
            });
            // Smooth scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Scanning Fleet Frequencies...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: STRATEGIC MONITORING HUB (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                                <Target size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Target Command</h1>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1">Tactical Mission Distribution Hub</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                                <input 
                                    type="text"
                                    placeholder="Filter fleet..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:ring-2 ring-indigo-500/10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Grid size={14} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><ListIcon size={14} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Performance Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Fleet', value: employees.length, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
                            { label: 'Active Missions', value: employees.filter(e => e.currentDailyTarget > 0).length, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                            { label: 'Fleet Efficiency', value: `${employees.length > 0 ? Math.round((employees.reduce((acc, curr) => acc + (curr.achieved/Math.max(1, curr.currentDailyTarget)), 0) / employees.length) * 100) : 0}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' }
                        ].map((stat, i) => (
                            <div key={i} className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 group hover:border-indigo-500/30 transition-all cursor-default">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={20} /></div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                    <h3 className="text-xl font-black text-gray-950 dark:text-white tracking-tighter">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fleet Grid/List */}
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                        {filteredEmployees.map((emp, idx) => (
                            <div 
                                key={emp.id}
                                onClick={() => setSelectedForAssign(emp)}
                                className={`group relative bg-white dark:bg-gray-900 ${viewMode === 'grid' ? 'rounded-[2rem] p-5' : 'rounded-2xl p-3 flex items-center justify-between'} border ${selectedForAssign?.id === emp.id ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-gray-100 dark:border-gray-800'} transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                            <img src={`https://i.pravatar.cc/150?u=${emp.id}`} alt={emp.name} className="w-full h-full object-cover" />
                                        </div>
                                        {emp.currentDailyTarget > 0 && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{emp.name}</h4>
                                        <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                            <MapPin size={8} /> {emp.zone}
                                        </div>
                                    </div>
                                </div>

                                <div className={viewMode === 'grid' ? "mt-4 space-y-2" : "flex-grow px-8"}>
                                    <div className="flex items-end justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-black text-gray-900 dark:text-white">{emp.achieved}</span>
                                            <span className="text-[9px] font-bold text-gray-400">/ {emp.currentDailyTarget || 0}</span>
                                        </div>
                                        <span className={`text-[10px] font-black ${emp.achieved >= emp.currentDailyTarget && emp.currentDailyTarget > 0 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                                            {emp.currentDailyTarget > 0 ? Math.round((emp.achieved / emp.currentDailyTarget) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${emp.achieved >= emp.currentDailyTarget && emp.currentDailyTarget > 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${Math.min(100, (emp.currentDailyTarget > 0 ? (emp.achieved/emp.currentDailyTarget)*100 : 0))}%` }}
                                        />
                                    </div>
                                </div>

                                {viewMode === 'list' && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); navigate(`/manager/targets/${emp.id}`); }}
                                        className="p-2 text-gray-300 hover:text-indigo-500 transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: TACTICAL DEPLOYMENT SIDEBAR (4 Columns) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Assignment Panel */}
                    <div className="bg-gradient-to-br from-indigo-900 via-gray-950 to-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group/assign border border-indigo-500/20">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover/assign:scale-125 transition-transform duration-1000">
                            <Zap size={150} className="text-indigo-400" />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                                    <UserPlus size={20} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Target Deployment</p>
                                    <p className="text-[12px] font-black uppercase tracking-tighter">Mission Assigner</p>
                                </div>
                            </div>

                            <form onSubmit={handleQuickAssign} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Select Operative</label>
                                    <select 
                                        className="w-full px-5 py-4 bg-gray-900 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:ring-2 ring-indigo-500/50 transition-all cursor-pointer appearance-none shadow-inner"
                                        value={selectedForAssign?.id || ''}
                                        onChange={(e) => setSelectedForAssign(employees.find(emp => emp.id === e.target.value))}
                                    >
                                        <option value="" className="text-gray-500">Awaiting selection...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Target Quota</label>
                                        <input 
                                            type="number"
                                            required
                                            min="1"
                                            placeholder="00"
                                            className="w-full px-5 py-4 bg-gray-900 border border-white/5 rounded-2xl outline-none font-black text-lg text-indigo-400 focus:ring-2 ring-indigo-500/50 transition-all shadow-inner"
                                            value={quickTarget.dailyTarget}
                                            onChange={(e) => setQuickTarget({...quickTarget, dailyTarget: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Mission Date</label>
                                        <input 
                                            type="date"
                                            required
                                            className="w-full px-5 py-4 bg-gray-900 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:ring-2 ring-indigo-500/50 transition-all [color-scheme:dark]"
                                            value={quickTarget.date}
                                            onChange={(e) => setQuickTarget({...quickTarget, date: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-4 bg-indigo-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>Deploy Mission <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* History Ledger */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400"><History size={16} /></div>
                                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Recent Transmissions</h3>
                            </div>
                            <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-[8px] font-black text-indigo-600 uppercase tracking-widest">Global Log</span>
                        </div>

                        <div className="space-y-4 flex-1">
                            {employees.filter(e => e.currentDailyTarget > 0).length > 0 ? employees.filter(e => e.currentDailyTarget > 0).map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center text-[10px] font-black text-indigo-500 shadow-sm">{log.name.charAt(0)}</div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase leading-none mb-1">{log.name}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Active Today</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-indigo-600">{log.currentDailyTarget} <span className="text-[8px] text-gray-400">UNITS</span></p>
                                            <p className="text-[7px] font-black text-emerald-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Transmitted</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => handleEditTarget({ empId: log.id, target: log.currentDailyTarget })}
                                                className="p-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-indigo-600 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                                                title="Edit Mission"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTarget(log.targetId, log.name)}
                                                className="p-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-rose-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                                                title="Abort Mission"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30">
                                    <Zap size={32} className="mb-3" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">No Recent Signals</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => employees.length > 0 && navigate(`/manager/targets/${employees[0].id}`)}
                            className="mt-6 w-full py-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-500 transition-all"
                        >
                            View Comprehensive Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Targets;
