import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as authServiceLogin } from '../../services/core/authService';
import { ShieldCheck, Lock, Mail, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Dialog from '../../components/ui/Dialog';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';

const LoginPage = ({ portal = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const { login: globalLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Pass null portal - backend will resolve based on user's default role
      const u = await authServiceLogin(email, password, 'SUPER_ADMIN');

      // Synchronize with global AuthContext
      globalLogin(u);

      // Unified Application Routing
      const targetRole = u.role.toLowerCase();
      const currentPortal = (portal || '').toLowerCase();
      // Normalize role names
      const normalizedTargetRole = targetRole === 'super_admin' ? 'superadmin' : targetRole;
      const normalizedCurrentPortal = currentPortal === 'super_admin' ? 'superadmin' : currentPortal;

      if (normalizedTargetRole === normalizedCurrentPortal || !normalizedCurrentPortal) {
        // Same portal - smooth SPA navigation
        navigate(`/${normalizedTargetRole}/dashboard`, { replace: true });
      } else {
        // Cross-portal jump: Handle local vs production environments
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocal) {
          // Local development: map roles to their specific Vite ports
          const portalPorts = {
            employee: 5173,
            manager: 5174,
            tenant: 5175,
            superadmin: 5176
          };
          const targetPort = portalPorts[normalizedTargetRole] || window.location.port;
          window.location.href = `http://${window.location.hostname}:${targetPort}/${normalizedTargetRole}/dashboard`;
        } else {
          // In production: use absolute path (assumes same domain hosting or proxy)
          window.location.href = `/${normalizedTargetRole}/dashboard`;
        }
      }

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(message);
      setShowErrorModal(true);

    } finally {
      setLoading(false);
    }
  };

  const allQuickLogins = [
    { label: 'Select Test Account', email: '', password: '', role: 'ALL' },
    { label: 'Employee', email: 'employee2@gmail.com', password: 'employee2@gmail.com', role: 'EMPLOYEE' },
  ];

  // Unified Access Portal always shows all test accounts
  const quickLogins = allQuickLogins;

  const handleQuickLogin = (e) => {
    const selected = quickLogins.find(l => l.label === e.target.value);
    if (selected && selected.email) {
      setEmail(selected.email);
      setPassword(selected.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary-main rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Home Page</span>
        </Link>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 bg-primary-main`}></div>
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group transition-transform hover:scale-105 active:scale-95">
            <div className={`bg-primary-main w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl mb-6 shadow-inherit/20 group-hover:rotate-3 transition-transform duration-300`}>
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">TrackForce</h2>
          </Link>
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">Unified Access Portal</p>
        </div>

        {/* Quick Login Dropdown */}
        <div className="mb-8 p-4 bg-primary-main/5 dark:bg-primary-main/10 border border-primary-main/10 dark:border-primary-main/20 rounded-2xl">
          <p className="text-[10px] font-black text-primary-main uppercase tracking-widest mb-2 px-1">Quick Login (Testing)</p>
          <select
            className="w-full bg-white dark:bg-gray-800 border-2 border-primary-main/10 dark:border-primary-main/20 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none focus:border-primary-main/30 transition-all cursor-pointer"
            onChange={handleQuickLogin}
            value={quickLogins.find(l => l.email === email)?.label || 'Select Test Account'}
          >
            {quickLogins.map(login => (
              <option key={login.label} value={login.label} className="dark:bg-gray-800">{login.label}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                />
              </div>
            </div>
          </div>
          <Button disabled={loading} variant="primary" className="w-full py-5 rounded-2xl">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-black uppercase tracking-widest text-xs">Sign In</span>
                <ChevronRight size={18} />
              </div>
            )}
          </Button>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-main font-black hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {showErrorModal && (
        <Dialog
          title="Access Denied"
          message={error}
          type="error"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;






