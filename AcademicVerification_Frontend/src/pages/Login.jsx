import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  User, Lock, Eye, EyeOff, GraduationCap, 
  ArrowRight, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failure. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        
        {/* Logo/Title Section */}
        <div className="text-center mb-10 fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl shadow-emerald-500/20 flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-white/20">
            <GraduationCap className="text-white" size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Welcome Back</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Academic Verification System</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-10 relative group border border-white/10 hover:border-white/20 transition-all duration-500">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-rose-400" size={18} />
              <p className="text-rose-200 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] ml-1">Identity Username</label>
                <div className="relative group/field">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your index name" 
                    required 
                    className="glass-input !pl-12 w-full"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Access Key</label>
                </div>
                <div className="relative group/field">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={20} />
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    className="glass-input !pl-12 !pr-14 w-full"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <>Sign In to Vault <ArrowRight size={20} strokeWidth={3} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               Node Status: Encrypted & Secure
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-white/30 text-sm font-bold flex items-center justify-center gap-3">
            Missing in registry?
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-black uppercase text-xs tracking-widest transition-all hover:gap-3 flex items-center gap-2 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20">
              Initialize Account <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
