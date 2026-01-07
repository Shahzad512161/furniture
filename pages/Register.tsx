
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user) throw new Error("User creation failed in Authentication.");

      // 2. Determine Role
      const isAdminEmail = email.toLowerCase().startsWith('admin');
      const assignedRole = isAdminEmail ? 'admin' : 'customer';

      // 3. Create User Document in Firestore
      const userDocData = {
        uid: user.uid,
        email: email.toLowerCase(),
        fullName: fullName.trim(),
        role: assignedRole,
        createdAt: Date.now(),
        phone: '',
        address: '',
        city: '',
        postalCode: ''
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userDocData);
        
        // 4. Verify Document Existence immediately
        const verifyDoc = await getDoc(doc(db, 'users', user.uid));
        if (!verifyDoc.exists()) {
          throw new Error("Firestore document write confirmed but verification failed. Please try syncing from your profile.");
        }

        // 5. Update Context and Navigate
        await refreshProfile();
        navigate(assignedRole === 'admin' ? '/admin' : '/');
      } catch (fsErr: any) {
        console.error("Firestore error:", fsErr);
        setError(`Auth successful, but profile creation failed: ${fsErr.message}. You may need to manually sync your profile from the dashboard.`);
      }
    } catch (authErr: any) {
      console.error("Auth error:", authErr);
      setError(authErr.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
          <p className="text-slate-500">Join the Oak & Iron community</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex items-start gap-3 text-red-800 dark:text-red-400 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="font-medium">{error}</p>
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
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail size={16} /> Email Address
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="admin@example.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <p className="text-[10px] text-slate-400 italic">Emails starting with "admin" get automatic Admin Access.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Lock size={16} /> Password
            </label>
            <input
              required
              type="password"
              minLength={6}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-amber-600 text-white py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-200 dark:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Securing Profile...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t dark:border-slate-700">
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
