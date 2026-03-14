import { Bell, Search, User, Calendar, CheckCircle2, Info, ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

const Navbar = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const lowImportanceNotifications = [
    { id: 101, title: 'Follow-up Reminder', desc: 'Visit Indiranagar store by 5 PM.', time: '3h ago', type: 'info' },
    { id: 102, title: 'System Update', desc: 'App updated to v2.4.1', time: 'Yesterday', type: 'info' },
    { id: 103, title: 'Profile Verified', desc: 'Your documents are approved.', time: '2 days ago', type: 'success' },
  ];

  return (
    <nav className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20 transition-colors duration-300">
      <div className="w-96 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input type="text" placeholder="Quick search..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main/10 outline-none" />
      </div>

      <div className="flex items-center space-x-6 relative">
        <ThemeToggle />
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-2xl transition-all relative ${showNotifications ? 'bg-indigo-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-indigo-600'}`}
            >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                  3
                </span>
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                        <span className="font-black text-sm tracking-tight text-gray-900 dark:text-white">Recent Updates</span>
                        <span className="text-[10px] font-black text-primary-main uppercase tracking-widest bg-primary-main/5 px-2 py-1 rounded-lg">Low Priority</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {lowImportanceNotifications.map((n) => (
                            <div key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer group">
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-xl h-fit ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {n.type === 'success' ? <CheckCircle2 size={14} /> : <Info size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-main transition-colors">{n.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{n.desc}</p>
                                        <span className="text-[10px] text-gray-400 mt-2 block">{n.time}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 self-center" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                        <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary-main transition-colors">View All Notifications</button>
                    </div>
                </div>
            )}
        </div>
        <div className="flex items-center space-x-3 pl-6 border-l border-gray-100 dark:border-gray-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{user?.name || 'Guest'}</p>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{user?.role || 'user'}</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"><User size={20} /></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
