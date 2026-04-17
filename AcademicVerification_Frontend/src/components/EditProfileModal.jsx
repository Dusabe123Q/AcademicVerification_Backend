import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  XCircle, User, Mail, Phone, 
  Briefcase, GraduationCap, FileText,
  Save, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, onUpdate, alumniId = null }) => {
  const [formData, setFormData] = useState({
    grad_year: '',
    career_info: '',
    current_employer: '',
    position: '',
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      setSuccess(false);
      setError(null);
    }
  }, [isOpen, alumniId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const endpoint = alumniId ? `/alumni/${alumniId}` : '/alumni/me';
      const response = await api.get(endpoint);
      if (response.data) {
        setFormData({
          grad_year: response.data.grad_year || '',
          career_info: response.data.career_info || '',
          current_employer: response.data.current_employer || '',
          position: response.data.position || '',
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || ''
        });
      }
    } catch (err) {
      setError('Neural handshake failed. Profile data unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        grad_year: formData.grad_year ? parseInt(formData.grad_year) : null
      };
      
      const endpoint = alumniId ? `/alumni/${alumniId}` : '/alumni/profile';
      await api.put(endpoint, payload);
      setSuccess(true);
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Registry update failure. Sync logic error.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="glass-card max-w-2xl w-full p-10 relative z-10 animate-in zoom-in-95 duration-300 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
            <XCircle size={28} strokeWidth={1} />
        </button>

        <div className="flex items-center gap-5 mb-10 pb-6 border-b border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <User size={28} strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">Edit Identity</h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Update Registry Metadata</p>
            </div>
        </div>

        {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-pulse">
                <AlertCircle className="text-rose-400" size={18} />
                <p className="text-rose-200 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
        )}

        {success && (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-green-400" size={18} />
                <p className="text-green-200 text-xs font-bold uppercase tracking-tight">Syncing Changes with Ledger...</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Identity Name</label>
                <div className="relative group/field">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input !pl-12 w-full" placeholder="John Silver" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Node</label>
                <div className="relative group/field">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="glass-input !pl-12 w-full" placeholder="identity@domain.edu" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Grad Cycle</label>
                <div className="relative group/field">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input type="number" required value={formData.grad_year} onChange={e => setFormData({...formData, grad_year: e.target.value})} className="glass-input !pl-12 w-full" placeholder="2024" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Contact Vector</label>
                <div className="relative group/field">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="glass-input !pl-12 w-full" placeholder="+1 (555) 0000" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Assigned Employer</label>
                <div className="relative group/field">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input type="text" value={formData.current_employer} onChange={e => setFormData({...formData, current_employer: e.target.value})} className="glass-input !pl-12 w-full" placeholder="Tech Corp" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Position Authority</label>
                <div className="relative group/field">
                    <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="glass-input !pl-12 w-full" placeholder="Lead Spec" />
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Career Historical Brief</label>
            <div className="relative group/field">
                <FileText className="absolute left-4 top-4 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                <textarea
                    value={formData.career_info}
                    onChange={e => setFormData({...formData, career_info: e.target.value})}
                    className="glass-input !pl-12 w-full h-32 resize-none pt-4"
                    required
                    placeholder="Input career metadata here..."
                />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-3 bg-white/5 text-white/30 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              Cancel Sync
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-[2] btn-primary flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={18} strokeWidth={3} /> Commit Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

