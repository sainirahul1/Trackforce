import { Bell, Search, User, CheckCircle2, Info, ChevronRight, AlertCircle, AlertTriangle, CheckCheck, X, Settings, LogOut, Trash2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useNotifications } from '../context/NotificationContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' };
    case 'alert': return { icon: AlertTriangle, color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' };
    case 'task': return { icon: CheckCheck, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' };
    case 'reminder': return { icon: AlertCircle, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' };
    case 'account': return { icon: User, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' };
    case 'system': return { icon: Info, color: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
    case 'message': return { icon: Info, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' };
    default: return { icon: Info, color: 'bg-gray-50 text-gray-600' };
  }
};

const Navbar = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { unreadCount, allNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const role = user?.role || localStorage.getItem('role') || 'employee';

  const handleViewAll = () => {
    setShowNotifications(false);
    navigate(`/${role}/notifications`);
  };

  return (
    <nav className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-[100] transition-colors duration-300">
      <div className="w-96 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input type="text" placeholder="Quick search..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main/10 outline-none" />
      </div>

      <div className="flex items-center space-x-6 relative">
        <ThemeToggle />

        {/* Bell / Notifications */}
        <div className="relative">
            <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                className={`p-2.5 rounded-2xl transition-all relative ${showNotifications ? 'bg-indigo-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-indigo-600'}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-black text-sm tracking-tight text-gray-900 dark:text-white">Notifications</span>
                          <span className="text-[10px] font-bold text-gray-400">{unreadCount} unread</span>
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                            className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg transition-colors"
                          >
                            Mark all
                          </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                        {allNotifications.slice(0, 6).map((n) => {
                            const { icon: Icon, color } = getNotificationIcon(n.type);
                            return (
                                <div 
                                    key={n.id || n._id} 
                                    onClick={() => markAsRead(n.id || n._id)}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group flex gap-3 items-start ${!n.isRead ? 'bg-indigo-50/20 dark:bg-indigo-900/5' : ''}`}
                                >
                                    <div className={`p-2 rounded-xl h-fit shrink-0 ${color}`}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`text-sm font-bold truncate ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{n.title}</p>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-0.5" />}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id || n._id); }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-300 hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.desc}</p>
                                        <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                        {allNotifications.length === 0 && (
                            <div className="p-10 text-center space-y-2">
                                <Bell size={32} className="text-gray-200 mx-auto" />
                                <p className="text-xs text-gray-400 font-bold">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-800">
                        <button 
                            onClick={handleViewAll}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            View All Notifications →
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className={`p-2.5 rounded-2xl transition-all relative ${showNotifications ? 'bg-indigo-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-indigo-600'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-96 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-black text-sm tracking-tight text-gray-900 dark:text-white">Notifications</span>
                  <span className="text-[10px] font-bold text-gray-400">{unreadCount} unread</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg transition-colors"
                  >
                    Mark all
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                {allNotifications.slice(0, 6).map((n) => {
                  const { icon: Icon, color } = getNotificationIcon(n.type);
                  return (
                    <div
                      key={n.id || n._id}
                      onClick={() => markAsRead(n.id || n._id)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group flex gap-3 items-start ${!n.isRead ? 'bg-indigo-50/20 dark:bg-indigo-900/5' : ''}`}
                    >
                      <div className={`p-2 rounded-xl h-fit shrink-0 ${color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-bold truncate ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{n.title}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-0.5" />}
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id || n._id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-300 hover:text-rose-500 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.desc}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
                {allNotifications.length === 0 && (
                  <div className="p-10 text-center space-y-2">
                    <Bell size={32} className="text-gray-200 mx-auto" />
                    <p className="text-xs text-gray-400 font-bold">No notifications yet</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleViewAll}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <div
            className="flex items-center space-x-3 pl-6 border-l border-gray-100 dark:border-gray-800 cursor-pointer group"
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 dark:text-white leading-none group-hover:text-indigo-600 transition-colors">{user?.name || 'Guest'}</p>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{user?.role || 'user'}</p>
            </div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 border transition-all duration-300 ${showProfileDropdown ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 group-hover:border-indigo-500/30'}`}>
              <User size={20} />
            </div>
          </div>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <User size={32} />
                </div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{user?.name || 'Guest User'}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{user?.email || 'user@trackforce.com'}</p>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => { setShowProfileDropdown(false); navigate(`/${role}/profile`); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                >
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <User size={16} />
                  </div>
                  My Profile
                </button>
                <button
                  onClick={() => { setShowProfileDropdown(false); navigate(`/${role}/profile?modal=settings`); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                >
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <Settings size={16} />
                  </div>
                  Account Settings
                </button>
              </div>

              <div className="p-2 border-t border-gray-50 dark:border-gray-800">
                <button
                  onClick={() => { setShowProfileDropdown(false); localStorage.clear(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all group"
                >
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-colors">
                    <LogOut size={16} />
                  </div>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
