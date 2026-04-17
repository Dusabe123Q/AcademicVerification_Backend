import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Database, Activity, Clock, ShieldCheck, 
  Search, Filter, AlertCircle, RefreshCcw, 
  PlusCircle, Trash2, Edit3, Key
} from 'lucide-react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/audit');
      setLogs(response.data);
    } catch (err) {
      console.error("System Audit Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('CREATE')) return <PlusCircle className="text-emerald-400" size={18} />;
    if (action.includes('DELETE')) return <Trash2 className="text-rose-400" size={18} />;
    if (action.includes('UPDATE')) return <Edit3 className="text-amber-400" size={18} />;
    if (action.includes('LOGIN')) return <Key className="text-emerald-400" size={18} />;
    return <Activity className="text-blue-400" size={18} />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action.includes(filterAction);
    return matchesSearch && matchesAction;
  });

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin shadow-lg shadow-emerald-500/20" />
      <span className="text-white/40 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Synchronizing Global Ledger</span>
    </div>
  );

  return (
    <div className="pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2 flex items-center gap-5">
            <Database className="text-emerald-500" size={42} strokeWidth={3} />
            System Ledger
          </h1>
          <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3">
             <ShieldCheck size={14} className="text-emerald-400" /> Complete Audit Trail & Integrity Logs
          </p>
        </div>
        <button 
            onClick={fetchLogs}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all group"
        >
            <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 space-y-8 sticky top-28 border-white/10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Search Nodes</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                            type="text"
                            placeholder="Filter events..."
                            className="glass-input !pl-12 w-full text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Action Protocol</label>
                    <div className="grid grid-cols-1 gap-2">
                        {['ALL', 'CREATE', 'UPDATE', 'DELETE'].map((action) => (
                            <button
                                key={action}
                                onClick={() => setFilterAction(action)}
                                className={`px-5 py-3 rounded-xl text-left text-xs font-black tracking-[0.2em] uppercase transition-all border ${
                                    filterAction === action ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                     <p className="text-[10px] text-emerald-300 font-bold leading-relaxed">
                        Entries are immutable and synced directly from the central database node.
                     </p>
                </div>
            </div>
        </div>

        {/* Log List */}
        <div className="lg:col-span-3">
            <div className="glass-card overflow-hidden border-white/5">
                <div className="bg-white/5 p-6 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Filter className="text-emerald-400" size={18} />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Active Results</span>
                    </div>
                    <span className="bg-emerald-500/10 px-3 py-1 rounded-lg text-[10px] font-black text-emerald-400 border border-emerald-500/20">
                        {filteredLogs.length} BLOCKS
                    </span>
                </div>

                {filteredLogs.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="p-8 hover:bg-white/5 transition-all group/row">
                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-black/20 border border-white/10 group-hover/row:border-emerald-500/30 transition-colors shrink-0">
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter mb-1">NODE</span>
                                        <span className="text-white font-black text-lg">#{log.id}</span>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                                    {getActionIcon(log.action)}
                                                </div>
                                                <h3 className="text-xl font-black text-white tracking-tight group-hover/row:text-emerald-300 transition-colors">
                                                    {log.action}
                                                </h3>
                                            </div>
                                            <div className="flex items-center text-white/30 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                                <Clock size={12} className="mr-3 text-emerald-400" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 group-hover/row:border-white/10 transition-all">
                                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                                {log.details.replace(/[0-9]+$/, match => `<span class='text-emerald-400'>${match}</span>`)}
                                                <span className="text-emerald-400 font-black"> {log.details.match(/[0-9]+$/)?.[0]}</span>
                                                {log.details.replace(/[0-9]+$/, '')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center">
                        <AlertCircle className="mx-auto text-white/5 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Segment Vacant</h3>
                        <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">No ledger entries match the current synchronization parameters.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;

