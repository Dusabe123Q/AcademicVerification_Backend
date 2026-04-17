import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, History, CheckCircle, XCircle, Clock, 
  Download, Share2, QrCode, AlertCircle, Sparkles,
  ArrowRight, ShieldCheck, FileText
} from 'lucide-react';

const Verification = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [credentialId, setCredentialId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reqMsg, setReqMsg] = useState({ type: '', text: '' });

  // QR Modal state
  const [qrModal, setQrModal] = useState({ open: false, credId: null, serial: '' });
  const [qrImage, setQrImage] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Copy link toast
  const [copyMsg, setCopyMsg] = useState('');

  useEffect(() => { fetchVerifications(); }, []);

  const fetchVerifications = async () => {
    try {
      const response = await api.get('/verification');
      setVerifications(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access Denied. Verification records are restricted.');
      } else {
        setError('Failed to fetch verification engine data. ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReqMsg({ type: '', text: '' });
    try {
      await api.post('/verification', { credential_id: parseInt(credentialId) });
      setReqMsg({ type: 'success', text: 'Verification request injected into the ledger successfully.' });
      setCredentialId('');
      fetchVerifications();
    } catch (err) {
      setReqMsg({ type: 'error', text: err.response?.data?.error || 'Failed to initialize request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setError(null);
    try {
      await api.put(`/verification/${id}/status`, { status: newStatus });
      fetchVerifications();
    } catch (err) {
      setError('System failure during status update. ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDownloadPdf = async (credentialId, serial) => {
    try {
      const response = await api.get(`/credentials/${credentialId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.body.appendChild(document.createElement('a'));
      link.href = url;
      link.setAttribute('download', `academiverify-${serial || credentialId}.pdf`);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Vault access failed. Ensure you have proper decryption authority.');
    }
  };

  const handleCopyLink = (serial) => {
    const link = `${window.location.origin}/verify/${serial}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyMsg('Verification URL Copied');
      setTimeout(() => setCopyMsg(''), 2000);
    });
  };

  const openQrModal = async (credId, serial) => {
    setQrModal({ open: true, credId, serial });
    setQrLoading(true);
    try {
      const response = await api.get(`/credentials/${credId}/qrcode`, { responseType: 'blob' });
      setQrImage(window.URL.createObjectURL(new Blob([response.data], { type: 'image/png' })));
    } catch {
      setQrImage(null);
    } finally {
      setQrLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin shadow-lg" />
      <span className="text-white/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Syncing Verification Logic</span>
    </div>
  );

  return (
    <div className="pb-12 fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 flex items-center gap-4">
            <Search className="text-emerald-400" size={32} strokeWidth={3} />
            Verification Engine
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Request and monitor official credential audits</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-3xl border border-white/10 shadow-inner">
            <ActivityIcon size={20} className="text-green-400" />
            <span className="text-white font-black text-sm tracking-tight">Backend Decryption: <span className="text-emerald-400">Active</span></span>
        </div>
      </div>

      {/* Copy notification */}
      {copyMsg && (
        <div className="fixed top-28 right-10 z-[100] bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-10 border border-white/20">
          ✨ {copyMsg}
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 p-6 rounded-3xl border border-rose-500/20 mb-10 flex items-center gap-4 group">
          <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400 group-hover:scale-110 transition-transform">
            <AlertCircle size={24} />
          </div>
          <p className="text-rose-200 font-bold tracking-tight">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* NEW REQUEST FORM */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-28 group overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700" />
            
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-black text-white tracking-tight">Request Audit</h2>
            </div>

            <p className="text-[11px] text-white/40 leading-relaxed font-medium mb-6">
              Enter a Credential ID to initiate a formal verification request. This will notify the institutional node to perform a deep-level validation.
            </p>

            {reqMsg.text && (
              <div className={`p-4 rounded-2xl mb-8 text-xs font-bold ring-1 ${reqMsg.type === 'error' ? 'bg-rose-500/10 text-rose-400 ring-rose-500/20' : 'bg-green-500/10 text-green-400 ring-green-500/20'}`}>
                {reqMsg.text}
              </div>
            )}

            <form onSubmit={handleRequestVerification} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Entity Identifier (ID)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-emerald-400 font-black">#</span>
                  </div>
                  <input
                    type="number" required value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="glass-input !pl-10 w-full"
                    placeholder="E.g. 1042"
                  />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <>Initiate Audit <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-10 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                 <ShieldCheck size={16} className="text-emerald-400" strokeWidth={3} />
                 <span className="text-xs font-black text-white tracking-tight">Ledger Synergy</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed font-medium">Public nodes can verify via QR signatures without authentication credentials.</p>
            </div>
          </div>
        </div>

        {/* VERIFICATION HISTORY */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 border border-white/10">
                    <History size={20} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Audit History</h2>
              </div>
              <div className="flex items-center gap-2 bg-emerald-600/20 px-4 py-1.5 rounded-full border border-emerald-600/30">
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Database Index:</span>
                <span className="text-white font-black text-xs">{verifications.length}</span>
              </div>
            </div>

            <div className="min-h-[400px]">
              {verifications.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/10 mb-6 border border-white/5 animate-pulse">
                    <Clock size={40} strokeWidth={1} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Queue Vacuum</h3>
                  <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No verification cycles detected in this segment.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {verifications.map((v) => {
                    const credId = v.credential?.credential_id;
                    const serial = v.credential?.serial_number;
                    const isApproved = v.status === 'APPROVED';

                    return (
                      <div key={v.verification_id} className="p-8 hover:bg-white/5 transition-all group/row">
                        <div className="flex flex-col sm:flex-row justify-between gap-6">

                          <div className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover/row:border-emerald-500/30 transition-colors shadow-inner">
                              <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter leading-none mb-1">Index</span>
                              <span className="text-white font-black text-lg leading-none">#{v.verification_id}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-black text-white tracking-tight group-hover/row:text-emerald-300 transition-colors">
                                        {v.credential?.credential_type || 'Custom Request'}
                                    </h3>
                                    {serial && <span className="bg-white/5 px-3 py-0.5 rounded-md border border-white/10 text-[10px] font-black text-white/40 tracking-wider">SN: {serial}</span>}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                                        <Clock size={14} className="mr-2 text-emerald-400" />
                                        {new Date(v.request_date).toLocaleString()}
                                    </div>
                                    <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                                        <FileText size={14} className="mr-2 text-teal-400" />
                                        Ref: {credId || 'N/A'}
                                    </div>
                                </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-4">
                            {/* Status Section */}
                            <div className="flex items-center gap-4">
                               <div className={`px-4 py-2 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase border flex items-center gap-2 ${
                                  v.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                  v.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                               }`}>
                                  {v.status === 'PENDING' ? <Sparkles size={14} className="animate-pulse" /> : v.status === 'APPROVED' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                  {v.status}
                               </div>

                               {/* Admin Controls */}
                               {v.status === 'PENDING' && (
                                 <div className="flex gap-2">
                                   <button onClick={() => handleUpdateStatus(v.verification_id, 'APPROVED')} className="p-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-xl border border-green-500/30 transition-all">
                                      <CheckCircle size={18} strokeWidth={2.5} />
                                   </button>
                                   <button onClick={() => handleUpdateStatus(v.verification_id, 'REJECTED')} className="p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl border border-rose-500/30 transition-all">
                                      <XCircle size={18} strokeWidth={2.5} />
                                   </button>
                                 </div>
                               )}
                            </div>

                            {/* Actions */}
                            {isApproved && credId && (
                              <div className="flex gap-3">
                                <button onClick={() => handleDownloadPdf(credId, serial)} className="p-3 bg-white/5 hover:bg-emerald-600 text-white/60 hover:text-white rounded-2xl border border-white/10 transition-all shadow-sm group/btn" title="Download Vault PDF">
                                    <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                                <button onClick={() => handleCopyLink(serial)} className="p-3 bg-white/5 hover:bg-teal-600 text-white/60 hover:text-white rounded-2xl border border-white/10 transition-all shadow-sm group/btn" title="Generate Share Access">
                                    <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                                <button onClick={() => openQrModal(credId, serial)} className="p-3 bg-white/5 hover:bg-emerald-600 text-white/60 hover:text-white rounded-2xl border border-white/10 transition-all shadow-sm group/btn" title="Master QR Signature">
                                    <QrCode size={18} className="group-hover/btn:rotate-12 transition-transform" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setQrModal({ ...qrModal, open: false })} />
          <div className="glass-card max-w-sm w-full p-10 relative z-10 text-center animate-in zoom-in-95 duration-300">
            <button onClick={() => setQrModal({ ...qrModal, open: false })} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
              <XCircle size={28} strokeWidth={1} />
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                <QrCode size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Ledger Signature</h3>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mb-8 font-mono break-all">{qrModal.serial}</p>
            
            <div className="p-8 bg-white rounded-3xl shadow-inner mb-8 ring-8 ring-white/5">
              {qrLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                </div>
              ) : qrImage ? (
                <>
                  <img src={qrImage} alt="QR Code" className="mx-auto" />
                  <div className="mt-6 flex items-center justify-center gap-2 text-emerald-900/40">
                      <ShieldCheck size={16} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified Seed</span>
                  </div>
                </>
              ) : (
                <div className="py-12 text-rose-500 font-bold">Injected Logic Error</div>
              )}
            </div>
            
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Scan with any standard optical reader to verify credential integrity externally.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Help Icons
const PlusIcon = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ActivityIcon = (props) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;

export default Verification;

