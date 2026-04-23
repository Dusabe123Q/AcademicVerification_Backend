import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, UserPlus, GraduationCap, Search, Filter, 
  CheckCircle, Clock, Mail, Phone, BookOpen,
  ShieldCheck, ArrowRight, Activity, Zap, AlertCircle,
  Edit3, Trash2, Save, X
} from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', phone: '', registrationNumber: '', faculty: '', program: '', dob: ''
  });

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('System retrieval error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGraduate = async (id) => {
    if (!window.confirm('Executing graduation sequence. This will migrate the student to the Alumni Ledger. Proceed?')) return;
    try {
      await api.post(`/admin/students/${id}/graduate`);
      fetchStudents();
    } catch (error) {
      console.error('Graduation logic failure:', error);
      alert('Strategic failure during graduation protocol.');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAddError(null);
    try {
      await api.post('/admin/students', newStudent);
      setShowAddModal(false);
      fetchStudents();
      setNewStudent({ name: '', email: '', phone: '', registrationNumber: '', faculty: '', program: '', dob: '' });
    } catch (error) {
      console.error('Insertion failed:', error);
      setAddError(error.response?.data?.message || error.response?.data?.error || 'System integration failure.');
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setEditError(null);
    try {
      await api.put(`/admin/students/${editingStudent.student_id}`, editingStudent);
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Update failed:', error);
      setEditError(error.response?.data?.message || error.response?.data?.error || 'Update failed.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`PERMANENT DELETION PROTOCOL: Are you sure you want to purge ${name} from the registry?`)) return;
    try {
      await api.delete(`/admin/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Deletion failure:', error);
      alert('Strategic failure during deletion protocol.');
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin shadow-lg" />
      <span className="text-white/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Accessing Student Registry</span>
    </div>
  );

  return (
    <div className="pb-12 fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 flex items-center gap-4">
            <Users className="text-emerald-400" size={32} strokeWidth={3} />
            Student Registry
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Academic Lifecycle Management & Oversight</p>
        </div>
        <button 
          onClick={() => { setShowAddModal(true); setAddError(null); }}
          className="btn-primary flex items-center justify-center gap-3"
        >
          <UserPlus size={20} strokeWidth={3} /> Register New Entity
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
        <div className="glass-card p-8 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Total Indexed</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{students.length}</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
               <Users size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-8 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-700" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Active Entities</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{students.filter(s => s.status === 'STUDENT').length}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-2xl text-green-400 border border-green-500/30">
               <Activity size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div className="glass-card p-8 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Alumni Cohort</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{students.filter(s => s.status !== 'STUDENT').length}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
               <GraduationCap size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/10 flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/5">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by identity or registration hash..." 
              className="glass-input !pl-14 w-full h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-white/5 px-6 rounded-2xl border border-white/10 h-12 hover:bg-white/10 transition-colors w-full lg:w-auto">
                <Filter size={18} className="text-emerald-400" />
                <select 
                  className="bg-transparent border-none text-white text-xs font-black uppercase tracking-widest focus:ring-0 cursor-pointer outline-none w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL" className="bg-slate-900">Show All Entities</option>
                  <option value="STUDENT" className="bg-slate-900">Active Only</option>
                  <option value="GRADUATE" className="bg-slate-900">Graduates Only</option>
                  <option value="ALUMNI" className="bg-slate-900">Global Alumni</option>
                </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Student Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Academic Context</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Communication Vector</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Registry Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 mx-auto mb-6 border border-white/5">
                         <Zap size={32} />
                      </div>
                      <h3 className="text-xl font-black text-white/40 tracking-tight">No Matches Found</h3>
                   </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.student_id} className="hover:bg-white/5 transition-all group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/10 group-hover/row:scale-110 transition-transform">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-white tracking-tight group-hover/row:text-emerald-400 transition-colors leading-none mb-2">{student.name}</p>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{student.program}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white font-bold text-sm tracking-tight leading-none mb-2">{student.registrationNumber || 'UNLOGGED'}</p>
                      <div className="flex items-center text-emerald-400/60 text-[10px] font-black uppercase tracking-widest">
                        <BookOpen size={12} className="mr-2" strokeWidth={2.5} /> {student.faculty || 'Core Systems'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5 font-bold text-xs">
                          <p className="text-white/60 flex items-center transition-colors group-hover/row:text-white"><Mail size={14} className="mr-3 text-emerald-400/40" /> {student.email}</p>
                          <p className="text-white/40 flex items-center"><Phone size={14} className="mr-3 text-teal-400/40" /> {student.phone}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border flex items-center gap-2 w-fit ${
                        student.status === 'STUDENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        student.status === 'GRADUATE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'STUDENT' ? 'bg-emerald-400' : 'bg-green-400'}`} />
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all scale-95 group-hover/row:scale-100">
                        {student.status === 'STUDENT' && (
                          <>
                            <button 
                              onClick={() => handleGraduate(student.student_id)}
                              className="p-3 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-2xl border border-green-500/20 transition-all shadow-sm flex items-center gap-2 group/btn"
                              title="Graduate Student"
                            >
                              <GraduationCap size={16} strokeWidth={2.5} /> 
                            </button>
                            <button 
                              onClick={() => { setEditingStudent({...student}); setShowEditModal(true); setEditError(null); }}
                              className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-2xl border border-blue-500/20 transition-all shadow-sm"
                              title="Edit Identity"
                            >
                              <Edit3 size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(student.student_id, student.name)}
                          className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl border border-rose-500/20 transition-all shadow-sm"
                          title="Purge Record"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowAddModal(false)} />
          <div className="glass-card max-w-2xl w-full p-10 relative z-10 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-8 border-b border-white/10 pb-6">Integrate New Entity</h2>
            
            {addError && (
              <div className="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 mb-8 flex items-start gap-4 animate-in slide-in-from-top-4">
                 <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
                    <AlertCircle size={18} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-1">Registration Failure</h4>
                    <p className="text-rose-200/60 text-[11px] font-bold leading-tight">{addError}</p>
                 </div>
              </div>
            )}

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Identity Name</label>
                <input type="text" required value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="glass-input w-full" placeholder="Full Legal Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Official Email</label>
                <input type="email" required value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} className="glass-input w-full" placeholder="email@university.edu" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Registry Hash (Reg No)</label>
                <input type="text" required value={newStudent.registrationNumber} onChange={(e) => setNewStudent({...newStudent, registrationNumber: e.target.value})} className="glass-input w-full" placeholder="REG-####-####" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Communication Vector (Phone)</label>
                <input type="text" required value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} className="glass-input w-full" placeholder="+250..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Faculty / Department</label>
                <input type="text" required value={newStudent.faculty} onChange={(e) => setNewStudent({...newStudent, faculty: e.target.value})} className="glass-input w-full" placeholder="Engineering / Computing" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Academic Program</label>
                <input type="text" required value={newStudent.program} onChange={(e) => setNewStudent({...newStudent, program: e.target.value})} className="glass-input w-full" placeholder="Computer Science" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Date of Birth</label>
                <input type="date" value={newStudent.dob} onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2 md:col-span-1 border-t border-white/5 pt-4">
                <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-3">
                   Confirm System Insertion <ShieldCheck size={20} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowEditModal(false)} />
          <div className="glass-card max-w-2xl w-full p-10 relative z-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h2 className="text-3xl font-black text-white tracking-tighter">Modify Entity: {editingStudent.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
            
            {editError && (
              <div className="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20 mb-8 flex items-start gap-4">
                 <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
                    <AlertCircle size={18} />
                 </div>
                 <p className="text-rose-200/60 text-[11px] font-bold">{editError}</p>
              </div>
            )}

            <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Identity Name</label>
                <input type="text" required value={editingStudent.name} onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Official Email</label>
                <input type="email" required value={editingStudent.email} onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Registry Hash (Reg No)</label>
                <input type="text" required value={editingStudent.registrationNumber} onChange={(e) => setEditingStudent({...editingStudent, registrationNumber: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Communication Vector (Phone)</label>
                <input type="text" required value={editingStudent.phone} onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Faculty / Department</label>
                <input type="text" required value={editingStudent.faculty} onChange={(e) => setEditingStudent({...editingStudent, faculty: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Academic Program</label>
                <input type="text" required value={editingStudent.program} onChange={(e) => setEditingStudent({...editingStudent, program: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Date of Birth</label>
                <input type="date" value={editingStudent.dob || ''} onChange={(e) => setEditingStudent({...editingStudent, dob: e.target.value})} className="glass-input w-full" />
              </div>
              <div className="space-y-2 md:col-span-1 border-t border-white/5 pt-4">
                <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-3">
                   Synchronize Changes <Save size={20} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;

