import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, ShieldAlert, BadgeCheck, FileText, 
  User, GraduationCap, Calendar, Hash, ArrowLeft,
  Search, Lock, Download, Share2, FileDown
} from 'lucide-react';
import api, { BASE_URL } from '../services/api';

const CredentialPublicPage = () => {
  const { serialNumber } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await api.get(`/public/verify/${serialNumber}`);
        setResult(response.data);
      } catch (err) {
        setError('Failed to establish a secure handshake with the verification ledger.');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [serialNumber]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-3xl px-8 py-4 border border-white/10 shadow-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl text-white tracking-tighter">AcademiVerify</span>
        </div>
        <p className="mt-4 text-white/30 text-[10px] uppercase font-black tracking-[0.4em]">Official Institutional Registry Portal</p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-xl z-10 scale-in duration-500">
        {loading ? (
             <div className="glass-card p-16 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
                <div className="w-16 h-16 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8 shadow-lg shadow-emerald-500/10" />
                <h3 className="text-white font-black text-xl tracking-tight mb-2">Decrypting Ledger...</h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest font-mono">{serialNumber}</p>
             </div>
        ) : error ? (
            <div className="glass-card p-12 text-center border-rose-500/20">
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-400 mx-auto mb-8 border border-rose-500/20">
                    <ShieldAlert size={40} />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight transition-colors">Handshake Failure</h2>
                <p className="text-white/40 text-sm font-medium leading-relaxed">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary mt-8">Retry Protocol</button>
            </div>
        ) : (
            <div className={`glass-card overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.5)] border-t-4 ${result.valid ? 'border-t-green-500' : 'border-t-rose-500'}`}>
                
                {/* Result Header */}
                <div className={`p-10 text-center relative overflow-hidden ${result.valid ? 'bg-green-500/5' : 'bg-rose-500/5'}`}>
                    <div className={`absolute inset-0 opacity-10 ${result.valid ? 'bg-gradient-to-br from-green-500' : 'bg-gradient-to-br from-rose-500'}`} />
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 relative z-10 border-4 transition-transform duration-700 hover:rotate-3 ${result.valid ? 'bg-green-500 border-green-400/50 text-white shadow-2xl shadow-green-500/20' : 'bg-rose-500 border-rose-400/50 text-white shadow-2xl shadow-rose-500/20'}`}>
                        {result.valid ? <BadgeCheck size={48} strokeWidth={2.5} /> : <ShieldAlert size={48} strokeWidth={2.5} />}
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter relative z-10 leading-none mb-3">
                        {result.valid ? 'IDENTITY SECURED' : 'INVALID NODEREF'}
                    </h1>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10 border ${result.valid ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                        {result.valid ? 'Verified by System' : 'Signature Unverified'}
                    </div>
                </div>

                {/* Data Display */}
                {result.valid ? (
                    <div className="p-10 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DataField icon={Hash} label="Public Index" value={result.serialNumber} mono />
                            <DataField icon={FileText} label="Credential Type" value={result.credentialType} />
                            <DataField icon={User} label="Linked Identity" value={result.studentName} />
                            <DataField icon={Download} label="Sync Cycle" value={result.issueDate} />
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Lock size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm tracking-tight mb-1">Cryptographic Integrity</p>
                                    <p className="text-white/30 text-[11px] font-medium leading-relaxed">This record matches the immutable ledger hosted by AcademiVerify. The digital signature has been verified against institutional master keys.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                             <button onClick={() => {navigator.clipboard.writeText(window.location.href); alert('Node Checkpoint URL Copied');}} className="btn-primary flex-1 flex items-center justify-center gap-3">
                                <Share2 size={18} /> Copy URL
                             </button>
                             <a 
                                href={`${BASE_URL}/api/credentials/public/${serialNumber}/pdf`}
                                className="flex-1 px-8 py-4 bg-emerald-500/10 text-emerald-400 font-black uppercase text-xs tracking-widest rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-center flex items-center justify-center gap-3"
                             >
                                <FileDown size={18} /> Official PDF
                             </a>
                             <Link to="/" className="flex-1 px-8 py-4 bg-white/5 text-white/60 font-black uppercase text-xs tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all text-center flex items-center justify-center gap-3">
                                <Search size={18} /> New Search
                             </Link>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 mx-auto mb-6 border border-white/5">
                             <Search size={32} />
                        </div>
                        <p className="text-white font-bold text-lg mb-4 tracking-tight">Zero Registry Hits</p>
                        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto font-medium lowercase italic">
                            the hash sequence <span className="text-rose-400 font-black font-mono not-italic">{serialNumber}</span> failed to resolve against any official academic ledger entries.
                        </p>
                    </div>
                )}
            </div>
        )}

        {/* Action Footer */}
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/" className="inline-flex items-center gap-3 text-white/40 hover:text-emerald-400 font-black text-xs uppercase tracking-[0.25em] transition-all group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Public Search Portal
            </Link>
        </div>
      </div>
      
      {/* System Status Indicator */}
      <div className="fixed bottom-6 right-10 flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">Nodes: Online</span>
      </div>
    </div>
  );
};

const DataField = ({ icon: IconComponent, label, value, mono = false }) => {
  const Icon = IconComponent;
  return (
    <div className="group/field">
      <div className="flex items-center gap-2 mb-2">
          <Icon className="text-emerald-400/50 group-hover/field:text-emerald-400 transition-colors" size={14} strokeWidth={3} />
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <p className={`text-white font-black text-lg tracking-tight group-hover/field:text-emerald-100 transition-colors ${mono ? 'font-mono' : ''}`}>
          {value || 'DATA_REDACTED'}
      </p>
    </div>
  );
};

export default CredentialPublicPage;

