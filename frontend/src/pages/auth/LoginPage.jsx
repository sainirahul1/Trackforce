import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { ShieldCheck, Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import ThemeToggle from '../../components/ThemeToggle';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const u = await login(email, password);
      // u.role will determine where we go
      navigate(`/${u.role}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogins = [
    { label: 'Select Test Account', email: '', password: '' },
    { label: 'Super Admin', email: 'superadmin@trackforce.com', password: 'admin123' },

    { label: '--- ReatchAll ---', email: '', password: '' },
    { label: 'ReatchAll Tenant', email: 'admin@reatchall.com', password: 'password123' },
    { label: 'ReatchAll Manager', email: 'manager@reatchall.com', password: 'password123' },
    { label: 'ReatchAll Employee 1', email: 'employee@reatchall.com', password: 'password123' },
    { label: 'ReatchAll Employee 2', email: 'employee2@reatchall.com', password: 'password123' },
    { label: 'ReatchAll Employee 3', email: 'employee3@reatchall.com', password: 'password123' },
    { label: 'ReatchAll Employee 4', email: 'employee4@reatchall.com', password: 'password123' },

    // { label: '--- MetaLogistics ---', email: '', password: '' },
    // { label: 'MetaLogistics Tenant', email: 'admin@metalogistics.com', password: 'password123' },
    // { label: 'MetaLogistics Manager', email: 'manager@metalogistics.com', password: 'password123' },
    // { label: 'MetaLogistics Employee', email: 'employee@metalogistics.com', password: 'password123' },

    // { label: '--- SwiftDelivery ---', email: '', password: '' },
    // { label: 'SwiftDelivery Tenant', email: 'admin@swiftdelivery.com', password: 'password123' },
    // { label: 'SwiftDelivery Manager', email: 'manager@swiftdelivery.com', password: 'password123' },
    // { label: 'SwiftDelivery Employee', email: 'employee@swiftdelivery.com', password: 'password123' },
  ];

  const handleQuickLogin = (e) => {
    const selected = quickLogins.find(l => l.label === e.target.value);
    if (selected && selected.email) {
      setEmail(selected.email);
      setPassword(selected.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
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
    </div>
  );
};

export default LoginPage;
