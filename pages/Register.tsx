
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setError(null);
    setLoading(true);
    
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        // Initialize profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email,
          fullName,
          role: 'customer',
          createdAt: Date.now()
        });
        navigate('/');
      } catch (fsErr: any) {
        console.error("Firestore user creation failed:", fsErr);
        if (fsErr.code === 'permission-denied') {
          setError("Account created, but database access was denied. Please check Firestore security rules.");
        } else {
          setError("Account created, but profile setup failed. You may need to log in again.");
        }
      }
    } catch (authErr: any) {
      setError(authErr.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold">Join Oak & Iron</h1>
          <p className="text-slate-500">Start your premium furniture journey</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <User size={16} /> Full Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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
            {loading ? 'Creating Account...' : 'Sign Up Now'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
