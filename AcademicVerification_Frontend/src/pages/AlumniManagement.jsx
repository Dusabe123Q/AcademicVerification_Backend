import React, { useState, useEffect, useContext } from 'react';
import api, { BASE_URL } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import { 
  UserPlus, Search, Filter, Trash2, Edit3, 
  GraduationCap, Mail, Phone, Briefcase, MapPin,
  ChevronRight, ArrowLeft
} from 'lucide-react';

const AlumniManagement = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlumniId, setSelectedAlumniId] = useState(null);
  const { role } = useContext(AuthContext);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', grad_year: '', current_employer: '', position: '', career_info: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  useEffect(() => { fetchAlumni(); }, []);

  useEffect(() => {
    let result = [...alumniList];
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(a =>
        (a.name || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.current_employer || '').toLowerCase().includes(q) ||
        (a.position || '').toLowerCase().includes(q)
      );
    }
    if (yearFilter) {
      result = result.filter(a => String(a.grad_year) === yearFilter);
    }
    setFiltered(result);
  }, [search, yearFilter, alumniList]);

  const fetchAlumni = async () => {
    try {
      const response = await api.get('/alumni');
      if (Array.isArray(response.data)) {
        setAlumniList(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
        setError('System retrieval failure. Invalid data format received from server.');
        setAlumniList([]);
      }
    } catch (err) {
      const msg = err.response?.status === 403 
        ? 'Access Denied (403). Your administrative identity lacks the necessary authority for this terminal.'
        : 'System retrieval failure. ' + (err.response?.data?.error || err.message);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Executing permanent deletion of alumni record. Confirm?')) return;
    try {
      await api.delete(`/alumni/${id}`);
      fetchAlumni();
    } catch (err) {
      alert('Deletion failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    try {
      await api.post('/alumni', { ...formData, grad_year: parseInt(formData.grad_year, 10) });
      setFormMsg({ type: 'success', text: 'New identity record integrated successfully.' });
      setFormData({ name: '', email: '', phone: '', grad_year: '', current_employer: '', position: '', career_info: '' });
      setIsCreating(false);
      fetchAlumni();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.error || 'Integration failed.' });
    }
  };

  const openEditModal = (id = null) => {
    setSelectedAlumniId(id);
    setIsEditModalOpen(true);
  };

  const gradYears = Array.isArray(alumniList) 
    ? [...new Set(alumniList.map(a => a.grad_year).filter(Boolean))].sort() 
    : [];

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-white/40 font-black uppercase text-xs tracking-[0.3em]">Syncing Directory</span>
    </div>
  );

  return (
    <div className="pb-12 fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 flex items-center gap-4">
            <GraduationCap className="text-emerald-400" size={32} strokeWidth={3} />
            Alumni Records
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
             {filtered.length} Indexed Nodes / {alumniList.length} Total
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          {role === 'ROLE_ALUMNI' && (
            <button onClick={() => openEditModal()} className="btn-primary flex items-center gap-3 w-full md:w-auto justify-center">
              <Edit3 size={18} strokeWidth={3} /> Edit Identity
            </button>
          )}
          {role === 'ROLE_ADMIN' && (
            <button onClick={() => setIsCreating(!isCreating)} className={isCreating ? "bg-white/5 text-white/60 px-8 py-3 rounded-2xl border border-white/10 font-black uppercase text-xs tracking-widest hover:bg-white/10" : "btn-primary flex items-center gap-3 w-full md:w-auto justify-center"}>
              {isCreating ? <><ArrowLeft size={18} strokeWidth={3} /> Return</> : <><UserPlus size={18} strokeWidth={3} /> Inject Record</>}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 p-6 rounded-3xl border border-rose-500/20 mb-8 text-rose-400 font-bold tracking-tight animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {/* CREATE FORM */}
      {isCreating && role === 'ROLE_ADMIN' && (
        <div className="glass-card p-10 mb-10 animate-in slide-in-from-top-10 duration-500">
          <h2 className="text-2xl font-black text-white mb-8 border-b border-white/10 pb-6 tracking-tight">Register New Identity</h2>
          {formMsg.text && (
            <div className={`p-5 rounded-2xl mb-8 font-bold text-xs uppercase tracking-widest ring-1 ${formMsg.type === 'error' ? 'bg-rose-500/10 text-rose-400 ring-rose-500/20' : 'bg-green-500/10 text-green-400 ring-green-500/20'}`}>
              {formMsg.text}
            </div>
          )}
          <form onSubmit={handleCreateSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InputField label="Full Identity Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} required placeholder="John Silver" />
              <InputField label="Entity Email" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} required placeholder="john@university.edu" />
              <InputField label="Communication Port" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} placeholder="+1 (555) 123-4567" />
              <InputField label="Graduation Cycle" type="number" value={formData.grad_year} onChange={v => setFormData({...formData, grad_year: v})} required placeholder="2024" min="1900" max="2100" />
              <InputField label="Assigned Employer" value={formData.current_employer} onChange={v => setFormData({...formData, current_employer: v})} placeholder="Global Tech Ltd" />
              <InputField label="Operational Position" value={formData.position} onChange={v => setFormData({...formData, position: v})} placeholder="Lead Engineer" />
            </div>
            <div className="mt-8">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block ml-1">Career Bio / Historical Summary</label>
              <textarea className="glass-input w-full min-h-[120px] resize-none"
                value={formData.career_info} onChange={e => setFormData({...formData, career_info: e.target.value})} required placeholder="Input comprehensive historical career data here..." />
            </div>
            <div className="mt-10 flex justify-end">
              <button type="submit" className="btn-primary !px-12">
                Commit Identity Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter Engine ── */}
      {!isCreating && (
        <>
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search identity bank by name, email, employer..."
                className="glass-input !pl-14 w-full h-14"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">✕</button>
              )}
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 h-14 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                  <Filter size={18} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest whitespace-nowrap">Cohort Cycle</span>
              </div>
              <select
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="bg-transparent border-none text-white text-sm font-black focus:ring-0 cursor-pointer outline-none min-w-[120px]"
              >
                <option value="" className="bg-slate-900">All Nodes</option>
                {gradYears.map(year => (
                  <option key={year} value={year} className="bg-slate-900">Cycle {year}</option>
                ))}
              </select>
              {yearFilter && (
                <button onClick={() => setYearFilter('')} className="bg-emerald-400/20 text-emerald-300 text-[9px] font-black uppercase px-2 py-1 rounded-md border border-emerald-400/30">Reset</button>
              )}
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Indexed Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Contact Vector</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Deployment</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-center">Cycle</th>
                    {role === 'ROLE_ADMIN' && <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Ops</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {!Array.isArray(filtered) || filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 mx-auto mb-6 border border-white/5">
                            <Search size={32} />
                         </div>
                         <h3 className="text-xl font-black text-white/40 tracking-tight">Access Buffer Empty</h3>
                         <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2">Try adjusting your query parameters.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((alumni) => (
                      <tr key={alumni.alumni_id || Math.random()} className="hover:bg-white/5 transition-colors group/row">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/10 group-hover/row:scale-110 transition-transform border border-white/10">
                                    {alumni.profileImageUrl ? (
                                      <img src={`${BASE_URL}${alumni.profileImageUrl}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      alumni.name ? alumni.name.charAt(0).toUpperCase() : '?'
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-white font-black tracking-tight leading-none mb-1 group-hover/row:text-emerald-400 transition-colors">{alumni.name || 'Anonymous Node'}</h4>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{alumni.position || 'Awaiting Placement'}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-white/60 text-xs font-bold leading-none">
                                    <Mail size={12} className="text-emerald-400/50" /> {alumni.email}
                                </div>
                                <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-wide leading-none pt-1">
                                    <Phone size={10} className="text-teal-400/50" /> {alumni.phone || 'No active line'}
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400/60 group-hover/row:text-emerald-400 transition-colors">
                                 <Briefcase size={16} />
                              </div>
                              <div>
                                 <p className="text-white font-bold text-sm tracking-tight leading-none mb-1">{alumni.current_employer || 'Independent'}</p>
                                 <div className="flex items-center gap-2">
                                     <MapPin size={10} className="text-rose-400/40" />
                                     <span className="text-[10px] text-white/20 font-black uppercase tracking-tighter">Verified Employment</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 shadow-inner group-hover/row:bg-emerald-500/20 transition-all">
                                CYCLE {alumni.grad_year}
                            </span>
                        </td>
                        {role === 'ROLE_ADMIN' && (
                          <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all scale-95 group-hover/row:scale-100">
                                  <button onClick={() => openEditModal(alumni.alumni_id)} className="p-2.5 bg-white/5 hover:bg-white/20 text-white/40 hover:text-white rounded-xl border border-white/10 transition-all" title="Edit identity">
                                      <Edit3 size={16} />
                                  </button>
                                  <button onClick={() => handleDelete(alumni.alumni_id)} className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl border border-rose-500/20 transition-all" title="Execute deletion">
                                      <Trash2 size={16} />
                                  </button>
                                  <button className="p-2.5 bg-white/5 hover:bg-emerald-500 text-white/40 hover:text-white rounded-xl border border-white/10 transition-all">
                                      <ChevronRight size={16} />
                                  </button>
                              </div>
                          </td>
                        )}
                      </tr>
                    )
                  )
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedAlumniId(null); }}
        onUpdate={fetchAlumni}
        alumniId={selectedAlumniId}
      />
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", required = false, placeholder = "", min, max }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">{label}</label>
    <input
      type={type} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      min={min} max={max}
      className="glass-input w-full"
    />
  </div>
);

export default AlumniManagement;

