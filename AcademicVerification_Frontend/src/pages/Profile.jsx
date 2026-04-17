import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import { 
  User, Mail, Phone, Calendar, Briefcase, GraduationCap, 
  Upload, Plus, Trash2, Edit2, Bell, CheckCircle, FileText,
  ShieldCheck, Globe, Download, Hash, Shield
} from 'lucide-react';
import WorkExperienceModal from '../components/WorkExperienceModal';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [certUploading, setCertUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchEmployment();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/alumni/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployment = async () => {
    try {
      const response = await api.get('/alumni/employment');
      setEmploymentHistory(response.data);
    } catch (error) {
      console.error('Error fetching employment:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/alumni/profile/image', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProfile();
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Neural sync failed: ' + (error.response?.data || 'Registry rejection. Verify your authentication status.'));
    } finally {
      setUploading(false);
    }
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setCertUploading(true);
    try {
      await api.post('/alumni/profile/certificate', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data'
        }
      });
      fetchProfile();
    } catch (error) {
      console.error('Certificate upload failed:', error);
      alert('Protocol error: ' + (error.response?.data || 'Access forbidden or network error.'));
    } finally {
      setCertUploading(false);
    }
  };

  const handleJobDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this work experience?')) return;
    try {
      await api.delete(`/alumni/employment/${id}`);
      fetchEmployment();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin shadow-lg" />
      <span className="text-white/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Fetching Profile Data</span>
    </div>
  );

  return (
    <div className="pb-12 fade-in">
      {/* Header Card */}
      <div className="glass-card overflow-hidden mb-10 group">
        {/* Banner with Ambient Light */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-emerald-900/40 h-48 md:h-64 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] group-hover:bg-emerald-500/30 transition-all duration-1000" />
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]" />
            
            <div className="absolute -bottom-20 left-10 flex items-end gap-8 pb-3 relative z-10 p-10">
                <div className="relative">
                    <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl border-4 border-white/10 overflow-hidden bg-white/5 backdrop-blur-2xl shadow-2xl relative group/avatar">
                        {profile?.profileImageUrl ? (
                        <img src={`${BASE_URL}${profile.profileImageUrl}`} alt="Profile" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 group-hover/avatar:text-emerald-400 transition-colors">
                            <User size={80} strokeWidth={1} />
                        </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-md">
                            <Upload className="text-white mb-2" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Update Image</span>
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                    {uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl z-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent shadow-lg"></div></div>}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-2xl border-4 border-[#1a1a2e] flex items-center justify-center shadow-lg" title="Profile Verified">
                        <ShieldCheck className="text-white" size={20} strokeWidth={3} />
                    </div>
                </div>
                
                <div className="mb-4 hidden md:block pb-5">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-lg">{profile?.name}</h1>
                        <span className="bg-white/10 backdrop-blur-md text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-[0.2em] shadow-sm">Official Record</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-white/60 font-black flex items-center text-sm uppercase tracking-widest leading-none">
                            <GraduationCap className="mr-3 text-emerald-400" size={18} /> Class of {profile?.grad_year || 'N/A'}
                        </p>
                        <p className="text-white/60 font-black flex items-center text-sm uppercase tracking-widest leading-none">
                            <Globe className="mr-3 text-teal-400" size={18} /> Verified Identity
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Tab Controls and Header Content (Mobile) */}
        <div className="pt-24 pb-8 px-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 bg-black/20">
          <div className="md:hidden text-center">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">{profile?.name}</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs leading-none">Class of {profile?.grad_year || 'N/A'}</p>
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'personal' ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('career')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'career' ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              Professional
            </button>
            <button 
              onClick={() => setActiveTab('credentials')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'credentials' ? 'bg-emerald-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              Academic
            </button>
          </div>
          <div className="flex gap-4">
            <button className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-all hover:bg-white/10">
                <Bell size={20} />
            </button>
            <button onClick={() => setShowEditModal(true)} className="btn-primary flex items-center gap-3">
                <Edit2 size={18} /> <span>Modify Profile</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'personal' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:items-start">
          {/* Details Card */}
          <div className="lg:col-span-2 glass-card p-10 group relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-white tracking-tighter flex items-center">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                        <User className="text-emerald-400" size={24} />
                    </div>
                    Master Data Record
                </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start p-6 bg-white/5 rounded-3xl border border-white/5 group/info hover:bg-white/10 transition-all">
                <Mail className="text-white/20 mr-5 group-hover/info:text-emerald-400 transition-colors mt-1" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1.5">Official Entity Email</span>
                  <span className="text-white font-bold text-lg tracking-tight truncate max-w-[200px]">{profile?.email}</span>
                </div>
              </div>
              <div className="flex items-start p-6 bg-white/5 rounded-3xl border border-white/5 group/info hover:bg-white/10 transition-all">
                <Phone className="text-white/20 mr-5 group-hover/info:text-emerald-400 transition-colors mt-1" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1.5">Communication Line</span>
                  <span className="text-white font-bold text-lg tracking-tight">{profile?.phone || 'Not Logged'}</span>
                </div>
              </div>
              <div className="flex items-start p-6 bg-white/5 rounded-3xl border border-white/5 group/info hover:bg-white/10 transition-all">
                <Calendar className="text-white/20 mr-5 group-hover/info:text-emerald-400 transition-colors mt-1" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1.5">Convocated Year</span>
                  <span className="text-white font-bold text-lg tracking-tight">{profile?.grad_year || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-start p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 group/info hover:bg-emerald-500/20 transition-all">
                <ShieldCheck className="text-emerald-400 mr-5 transition-transform group-hover/info:scale-110 mt-1" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-400/70 uppercase font-black tracking-widest mb-1.5">Validation Key</span>
                  <span className="text-white font-black text-lg tracking-widest">####-VERIFIED</span>
                </div>
              </div>
            </div>

            <div className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-transparent border border-white/10 text-white/60 text-sm italic font-medium leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-emerald-400 opacity-20"><FileText size={48} /></div>
                "The academic summary record below is verified and synchronized with the university blockchain. Any corrections must follow official documentation request protocols."
            </div>
          </div>

          {/* Certificate Card */}
          <div className="glass-card p-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 mb-8 border border-white/10 shadow-inner">
                <FileText size={32} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight text-center mb-4">Official Certificate</h2>
            <p className="text-white/40 text-center text-xs font-bold uppercase tracking-[0.2em] mb-10">Digital Ledger Copy</p>
            
            <div className="w-full border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center bg-black/20 text-center relative group/cert transition-all hover:bg-black/30 hover:border-white/20">
              {profile?.certificateUrl ? (
                <>
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/10 border border-green-500/30 group-hover/cert:scale-110 transition-transform">
                    <CheckCircle size={40} strokeWidth={2.5} />
                  </div>
                  <p className="text-white font-black text-lg mb-2">Vault Secured</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-8">Certificate Found In DB</p>
                  <a 
                    href={`${BASE_URL}${profile.certificateUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-3 no-underline"
                  >
                    <Download size={20} /> Preview Document
                  </a>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/5 text-white/10 rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <ShieldCheck size={32} strokeWidth={1} />
                  </div>
                  <p className="text-white/20 font-black text-center mb-8 uppercase tracking-widest text-xs">No records detected</p>
                  <label className={`btn-primary w-full cursor-pointer flex items-center justify-center gap-2 ${certUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {certUploading ? <RefreshCw className="animate-spin" size={18} /> : <><Upload size={18} /> Initialize Upload</>}
                    <input type="file" className="hidden" onChange={handleCertificateUpload} />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'career' ? (
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-8 rounded-3xl border border-white/10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Pro Career Timeline</h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Verified Work History & Experience</p>
            </div>
            <button 
              onClick={() => {setEditingJob(null); setShowJobModal(true);}}
              className="btn-primary flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Plus className="mr-2" size={20} strokeWidth={3} /> Register New Entry
            </button>
          </div>

          {employmentHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {employmentHistory.map((job) => (
                <div key={job.id} className="glass-card p-10 relative group border border-white/5 hover:border-white/20 transition-all hover:bg-white/10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Briefcase size={28} />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {setEditingJob(job); setShowJobModal(true);}}
                        className="p-3 bg-white/5 text-white/40 rounded-2xl hover:bg-white hover:text-emerald-600 shadow-sm transition-all border border-white/10"
                      >
                        <Edit2 size={18} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleJobDelete(job.id)}
                        className="p-3 bg-white/5 text-white/40 rounded-2xl hover:bg-rose-500 hover:text-white shadow-sm transition-all border border-white/10"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{job.jobTitle}</h3>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">{job.employer}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-wider">
                        <Calendar size={14} className="mr-2 text-emerald-400/50" />
                        {new Date(job.startDate).toLocaleDateString()} — {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Current'}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/20 border border-white/5 text-white/50 text-sm leading-relaxed italic font-medium">
                    "{job.description || 'Verified position in the digital workforce registry.'}"
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card py-24 text-center border-2 border-dashed border-white/10 opacity-60">
              <Briefcase size={64} className="mx-auto text-white/10 mb-8" />
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Empty Career Index</h3>
              <p className="text-white/30 mb-10 font-bold uppercase tracking-widest text-xs max-w-xs mx-auto"> Showcase your professional journey by adding your initial official entry.</p>
              <button 
                onClick={() => setShowJobModal(true)}
                className="text-emerald-400 font-black uppercase text-sm tracking-widest hover:text-white transition-colors"
              >
                + Register First Record
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-black text-white tracking-tighter">Academic Ledger</h2>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Verified records synchronized with the university central node.</p>
            </div>

            {profile?.student?.credentials?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {profile.student.credentials.map((cred) => (
                        <div key={cred.credential_id} className="glass-card p-8 flex flex-col gap-6 group hover:bg-white/10 border-white/5 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white leading-tight">{cred.credential_type}</h3>
                                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Institutional Credential</p>
                                    </div>
                                </div>
                                <div className="bg-green-500/20 text-green-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-green-500/30 uppercase tracking-widest">
                                    Verified
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Serial Node</p>
                                    <p className="text-white font-black tracking-widest text-xs truncate">{cred.serial_number}</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Issued Date</p>
                                    <p className="text-white font-black text-xs">{new Date(cred.issue_date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <a 
                                    href={`${BASE_URL}/api/credentials/public/${cred.serial_number}/pdf`}
                                    className="flex-1 btn-primary flex items-center justify-center gap-3 no-underline shadow-emerald-500/20"
                                >
                                    <Download size={18} strokeWidth={3} /> Official PDF
                                </a>
                                <button
                                    onClick={() => {navigator.clipboard.writeText(`http://localhost:5173/verify/${cred.serial_number}`); alert('Public Verification URL Copied');}}
                                    className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                                    title="Copy Verification Link"
                                >
                                    <Globe size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card py-24 text-center border-2 border-dashed border-white/10 opacity-60">
                    <GraduationCap size={64} className="mx-auto text-white/10 mb-8" />
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">No Credentials Logged</h3>
                    <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Your official academic record is not currently linked to this node.</p>
                </div>
            )}
        </div>
      )}

      {/* Modal Integration */}
      <WorkExperienceModal 
        isOpen={showJobModal} 
        onClose={() => setShowJobModal(false)}
        onSave={() => fetchEmployment()}
        editingJob={editingJob}
      />
      
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={() => fetchProfile()}
      />
    </div>
  );
};

export default Profile;

