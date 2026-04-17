import React, { useState, useEffect } from 'react';
import { XCircle, Briefcase, Calendar, AlignLeft, RefreshCw, Save } from 'lucide-react';
import api from '../services/api';

const WorkExperienceModal = ({ isOpen, onClose, onSave, editingJob }) => {
  const [formData, setFormData] = useState({
    employer: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        employer: editingJob.employer,
        jobTitle: editingJob.jobTitle,
        startDate: editingJob.startDate,
        endDate: editingJob.endDate || '',
        description: editingJob.description || ''
      });
    } else {
      setFormData({
        employer: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  }, [editingJob, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingJob) {
        await api.put(`/alumni/employment/${editingJob.id}`, formData);
      } else {
        await api.post('/alumni/employment', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Experience sync failure:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="glass-card max-w-lg w-full p-10 relative z-10 animate-in zoom-in-95 duration-300 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
            <XCircle size={28} strokeWidth={1} />
        </button>

        <div className="flex items-center gap-5 mb-10 pb-6 border-b border-white/10">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Briefcase size={28} strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                    {editingJob ? 'Edit Career Node' : 'Initialize Experience'}
                </h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Employment Registry Update</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Entity / Employer</label>
                <div className="relative group/field">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <input 
                      type="text" 
                      required
                      className="glass-input !pl-12 w-full"
                      placeholder="e.g. Global Tech Solutions"
                      value={formData.employer}
                      onChange={(e) => setFormData({...formData, employer: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Professional Assignment</label>
                <input 
                  type="text" 
                  required
                  className="glass-input w-full"
                  placeholder="e.g. Lead Systems Architect"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Activation Cycle</label>
                    <div className="relative group/field">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                        <input 
                          type="date" 
                          required
                          className="glass-input !pl-12 w-full"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Deactivation Cycle</label>
                    <div className="relative group/field">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                        <input 
                          type="date" 
                          className="glass-input !pl-12 w-full"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Operational Summary</label>
                <div className="relative group/field">
                    <AlignLeft className="absolute left-4 top-4 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={16} />
                    <textarea 
                      rows="3"
                      className="glass-input !pl-12 w-full h-28 resize-none pt-4"
                      placeholder="Describe high-level achievements..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-3 bg-white/5 text-white/30 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              Abort Sync
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] btn-primary flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={18} strokeWidth={3} /> Inject Data</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkExperienceModal;

