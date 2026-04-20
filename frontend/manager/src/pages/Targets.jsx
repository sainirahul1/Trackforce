import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Target, Search, Loader2, ArrowRight, ArrowLeft, History, Calendar, 
  CheckCircle2, TrendingUp, ChevronRight, Activity, Clock, 
  Users, BarChart3, UserPlus, Filter, Grid, List as ListIcon,
  Zap, MapPin, ExternalLink
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
    
    // Quick Assign Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedForAssign, setSelectedForAssign] = useState(null);
    const [quickTarget, setQuickTarget] = useState({
        dailyTarget: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            if (setPageLoading) setPageLoading(true);
            const response = await apiClient.get('/reatchall/manager/targets/employees');
            if (response.data.success) {
                setEmployees(response.data.data);
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
        e.preventDefault();
        try {
            setIsSaving(true);
            const response = await apiClient.post('/reatchall/manager/targets', {
                employeeId: selectedForAssign.id,
                ...quickTarget
            });
            if (response.data.success) {
                showAlert('Success', `Daily mission assigned to ${selectedForAssign.name}`, 'success');
                setIsAssignModalOpen(false);
                fetchEmployees();
            }
        } catch (error) {
            showAlert('Error', 'Failed to synchronize mission parameters', 'error');
        } finally {
            setIsSaving(false);
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
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-2xl shadow-indigo-200 rotate-3 animate-in zoom-in-50 duration-500">
                            <Target size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Target Command</h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Tactical Mission Distribution Hub</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 grow lg:max-w-3xl">
                    <div className="relative group grow w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Filter by Name, Zone, or Email..."
                            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/20 dark:shadow-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="primary" 
                        className="rounded-[1.5rem] px-8 py-5 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                        onClick={() => {
                            setSelectedForAssign(null);
                            setQuickTarget({
                                dailyTarget: '',
                                date: new Date().toISOString().split('T')[0],
                                note: ''
                            });
                            setIsAssignModalOpen(true);
                        }}
                    >
                        <UserPlus size={18} className="mr-2" />
                        Generate Target
                    </Button>
                    <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shrink-0">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tactical Grid */}
            {filteredEmployees.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-2"}>
                    {filteredEmployees.map((emp, idx) => (
                        <div 
                            key={emp.id}
                            className={`group relative bg-white dark:bg-gray-900 ${viewMode === 'grid' ? 'rounded-[2rem]' : 'rounded-2xl'} border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ${viewMode === 'list' ? 'hover:-translate-x-1' : 'hover:-translate-y-2'}`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* Card Content */}
                            <div className={`relative z-10 ${viewMode === 'grid' ? 'p-6 space-y-6' : 'p-3 flex items-center justify-between gap-4'}`}>
                                {/* User Info */}
                                <div 
                                    className={`flex items-center gap-3 cursor-pointer group/header ${viewMode === 'list' ? 'min-w-[200px]' : ''}`}
                                    onClick={() => navigate(`/manager/targets/${emp.id}`)}
                                >
                                    <div className="relative">
                                        <div className={`${viewMode === 'grid' ? 'w-12 h-12 rounded-[1.2rem]' : 'w-9 h-9 rounded-lg'} overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg group-hover/header:rotate-3 transition-transform duration-500`}>
                                            <img src={`https://i.pravatar.cc/150?u=${emp.id}`} alt={emp.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white scale-0 group-hover/header:scale-100 transition-transform duration-500 shadow-md">
                                            <Zap size={6} strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1 group-hover/header:text-indigo-600 transition-colors uppercase ${viewMode === 'grid' ? 'text-base' : 'text-xs'}`}>{emp.name}</h4>
                                        <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                            <MapPin size={8} className="text-gray-300" />
                                            {emp.zone}
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Section */}
                                <div className={`cursor-pointer ${viewMode === 'grid' ? 'space-y-3' : 'flex-grow px-4 max-w-md'}`} onClick={() => navigate(`/manager/targets/${emp.id}`)}>
                                    <div className={`flex items-end justify-between px-1 ${viewMode === 'grid' ? 'mb-1.5' : 'mb-1'}`}>
                                        <div className={viewMode === 'list' ? 'flex items-baseline gap-2' : ''}>
                                            {viewMode === 'grid' ? <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Today</p> : null}
                                            <div className="flex items-baseline gap-1">
                                                <span className={`${viewMode === 'grid' ? 'text-2xl' : 'text-sm'} font-black text-gray-900 dark:text-white tracking-tighter`}>{emp.achieved}</span>
                                                <span className="text-[9px] font-black text-gray-400">/ {emp.currentDailyTarget || 0}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black tracking-tight ${viewMode === 'grid' ? 'text-base' : 'text-xs'} ${emp.achieved >= emp.currentDailyTarget && emp.currentDailyTarget > 0 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                                                {emp.currentDailyTarget > 0 ? Math.round((emp.achieved / emp.currentDailyTarget) * 100) : 0}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-full ${viewMode === 'grid' ? 'h-1.5' : 'h-1'} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner`}>
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${emp.achieved >= emp.currentDailyTarget && emp.currentDailyTarget > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
                                            style={{ width: `${Math.min(100, (emp.currentDailyTarget > 0 ? (emp.achieved/emp.currentDailyTarget)*100 : 0))}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'pt-4 border-t border-gray-50 dark:border-gray-800 justify-between' : 'shrink-0'}`}>
                                    {viewMode === 'grid' ? <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{emp.designation}</span> : null}
                                    <div className="flex items-center gap-1.5">
                                        <button 
                                            className={`${viewMode === 'grid' ? 'p-2.5' : 'p-2'} bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm`}
                                            title="Generate Target"
                                            onClick={() => {
                                                setSelectedForAssign(emp);
                                                setQuickTarget(prev => ({ ...prev, dailyTarget: emp.currentDailyTarget || '' }));
                                                setIsAssignModalOpen(true);
                                            }}
                                        >
                                            <UserPlus size={viewMode === 'grid' ? 16 : 14} />
                                        </button>
                                        <button 
                                            className={`${viewMode === 'grid' ? 'p-2.5' : 'p-2'} bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all`}
                                            title="View History"
                                            onClick={() => navigate(`/manager/targets/${emp.id}`)}
                                        >
                                            <BarChart3 size={viewMode === 'grid' ? 16 : 14} />
                                        </button>
                                        {viewMode === 'list' ? (
                                            <button 
                                                className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400 hover:text-indigo-600 transition-all"
                                                onClick={() => navigate(`/manager/targets/${emp.id}`)}
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-40 text-center space-y-6 bg-white/50 dark:bg-gray-900/50 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-700">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Users size={48} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">No Fleet Signals Detected</h3>
                        <p className="text-gray-400 font-bold mt-2">Adjust your filters to scan broader sector frequencies.</p>
                    </div>
                    <Button onClick={() => setSearchTerm('')} variant="outline" className="rounded-2xl px-8">Reset Intelligence Filters</Button>
                </div>
            )}

            {/* Quick Assign Modal - Portalized for 100% Screen Coverage */}
            {isAssignModalOpen && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8">
                    {/* Unified Solid Opaque Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black animate-in fade-in duration-500" 
                        onClick={() => setIsAssignModalOpen(false)} 
                    />
                    
                    {/* Professional Command Center Modal Container - Reduced Size */}
                    <div className="relative w-full max-w-md bg-gray-950 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
                        {/* Header: Tactical Alert Blue - Extra Compact */}
                        <div className="p-5 bg-indigo-600 text-white relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
                            
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <button 
                                    onClick={() => setIsAssignModalOpen(false)} 
                                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/20 rounded-xl transition-all -ml-2 text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5"
                                >
                                    <ArrowLeft size={12} />
                                    <span>Abort</span>
                                </button>
                                <div className="p-1.5 bg-white/10 rounded-full">
                                    <Target size={16} className="animate-pulse" />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 relative z-10">
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                    <TrendingUp size={24} className="text-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Mission Parameters</h2>
                                    <p className="text-[9px] font-black text-indigo-100 uppercase tracking-[0.2em] opacity-60">
                                        {selectedForAssign ? `Operative: ${selectedForAssign.name}` : `Strategic Deployment Sector`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body: High-Fidelity Tactical Inputs - Extra Condensed */}
                        <form onSubmit={handleQuickAssign} className="p-6 space-y-5 bg-gray-950">
                            {!selectedForAssign && (
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-6">Target Operative</label>
                                    <select 
                                        required
                                        className="w-full px-6 py-4 bg-gray-900 border border-white/5 rounded-[1.5rem] outline-none font-bold text-xs text-gray-100 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all cursor-pointer appearance-none shadow-inner"
                                        onChange={(e) => setSelectedForAssign(employees.find(emp => emp.id === e.target.value))}
                                    >
                                        <option value="">Awaiting selection...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id} className="bg-gray-900">{emp.name} — {emp.zone}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-6">Deployment Window</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                                        <input 
                                            type="date"
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-gray-900 border border-white/5 rounded-[1.5rem] outline-none font-bold text-xs text-gray-100 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-inner [color-scheme:dark]"
                                            value={quickTarget.date}
                                            onChange={(e) => setQuickTarget({...quickTarget, date: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-6">Objective Quota</label>
                                    <div className="relative">
                                        <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                                        <input 
                                            type="number"
                                            required
                                            min="1"
                                            placeholder="Target count"
                                            className="w-full pl-14 pr-6 py-4 bg-gray-900 border border-white/5 rounded-[1.5rem] outline-none font-black text-lg text-indigo-400 placeholder:text-gray-700 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-inner"
                                            value={quickTarget.dailyTarget}
                                            onChange={(e) => setQuickTarget({...quickTarget, dailyTarget: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSaving || (!selectedForAssign && !quickTarget.employeeId)}
                                className="group relative w-full py-4 rounded-[2rem] bg-indigo-600 overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 transition-transform group-hover:scale-105" />
                                <div className="relative flex items-center justify-center gap-3">
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin text-white" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Transmitting Mission...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Authorize Mission Deployment</span>
                                            <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Targets;
