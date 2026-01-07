
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(redirect);
    } catch (error: any) {
      alert(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold">Welcome Back</h1>
          <p className="text-slate-500">Login to manage your orders and profile</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail size={16} /> Email Address
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Lock size={16} /> Password
            </label>
            <input
              required
              type="password"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-amber-600 text-white py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
