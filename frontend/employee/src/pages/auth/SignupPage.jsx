import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/core/authService';
import { ShieldCheck, Lock, Mail, User, Building2, ChevronRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { confirm, ...signupData } = form; // Remove confirm from data sent to server
      await register(signupData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
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

      <div className="max-w-md w-full bg-white dark:bg-gray-900 px-8 py-6 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-main" />

        {/* Logo */}
        <div className="text-center mb-5">
          <Link to="/" className="inline-flex items-center space-x-3 group transition-transform hover:scale-105 active:scale-95">
            <div className="bg-primary-main w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform duration-300">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">TrackForce</h2>
          </Link>
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Create Your Account</p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={36} />
            </div>
            <p className="text-xl font-black text-gray-900 dark:text-white">Account Created!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
              Redirecting you to the login page…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                />
              </div>
            </div>

            {/* Company */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  required
                  name="company"
                  type="text"
                  placeholder="Acme Corp"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                />
              </div>
            </div>

            {/* Password + Confirm in a 2-column row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                  <input
                    required
                    name="password"
                    type="password"
                    placeholder="Min. 6 chars"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
                  <input
                    required
                    name="confirm"
                    type="password"
                    placeholder="Re-enter"
                    value={form.confirm}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-primary-main/10 outline-none"
                  />
                </div>
              </div>
            </div>

            <Button disabled={loading} variant="primary" className="w-full py-4 rounded-2xl mt-1">
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-black uppercase tracking-widest text-xs">Create Account</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium pt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-main font-black hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
