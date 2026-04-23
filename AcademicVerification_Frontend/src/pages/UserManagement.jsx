import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, UserPlus, Search, Filter, 
  Trash2, Mail, Phone, Shield, 
  RefreshCw, CheckCircle2, AlertCircle, Key, ArrowRight
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', phone: '', role: 'ALUMNI'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user list.');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    console.log('Starting registration for:', formData);
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        password: null // Use null instead of empty string to avoid validation issues
      });
      
      console.log('Registration success:', response.data);
      setSuccess(response.data.message || 'User registered. Password sent to email.');
      setShowModal(false);
      setFormData({ username: '', email: '', phone: '', role: 'ALUMNI' });
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 flex items-center gap-4">
            <ShieldCheck className="text-emerald-400" size={32} strokeWidth={3} />
            User Access Control
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Security & Identity Lifecycle Management</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-3"
        >
          <UserPlus size={20} strokeWidth={3} /> Register New User
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl mb-8 flex items-center gap-4 animate-in zoom-in-95">
          <CheckCircle2 className="text-emerald-400" size={24} />
          <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl mb-8 flex items-center gap-4 animate-in zoom-in-95">
          <AlertCircle className="text-rose-400" size={24} />
          <p className="text-rose-400 font-bold uppercase tracking-widest text-xs">{error}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="glass-card p-10 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
            <Shield size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">How Registration Works</h2>
            <p className="text-white/50 leading-relaxed mb-8">
                When you register a user here, the system automatically generates a secure, unique password. 
                The password is encrypted immediately and sent directly to the user's provided email address. 
                <span className="text-emerald-400 font-bold"> Admins do not have access to plain-text passwords.</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <Key className="text-emerald-400 mb-4" size={24} />
                    <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">Auto-Generated</h3>
                    <p className="text-[10px] text-white/40 font-bold leading-normal">System creates a high-entropy password for every new account.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <Mail className="text-teal-400 mb-4" size={24} />
                    <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">Email Delivery</h3>
                    <p className="text-[10px] text-white/40 font-bold leading-normal">Credentials are dispatched via institutional SMTP nodes.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowModal(false)} />
           <div className="glass-card max-w-xl w-full p-10 relative z-10 animate-in zoom-in-95 duration-300 border border-white/10">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-8 border-b border-white/10 pb-6">New User Identity</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Unique Username</label>
                        <input 
                            type="text" required value={formData.username} 
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                            className="glass-input w-full" placeholder="e.g. jsmith_admin" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Official Email</label>
                        <input 
                            type="email" required value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            className="glass-input w-full" placeholder="user@organization.com" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Assigned Role</label>
                        <select 
                            value={formData.role} 
                            onChange={e => setFormData({...formData, role: e.target.value})}
                            className="glass-input w-full"
                        >
                            <option value="ALUMNI" className="bg-slate-900">Alumni / Graduate</option>
                            <option value="EMPLOYER" className="bg-slate-900">External Employer</option>
                            <option value="ADMIN" className="bg-slate-900">Institutional Admin</option>
                        </select>
                    </div>
                    
                    <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                            <Key size={18} />
                        </div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Password will be generated and emailed.</p>
                    </div>

                    <button 
                        type="submit" disabled={isSubmitting}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 mt-4"
                    >
                        {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <>Initialize Account Registration <ArrowRight size={20} strokeWidth={3} /></>}
                    </button>
                </form>
           </div>
        </div>
      )}
    </div>
  );
};



export default UserManagement;
