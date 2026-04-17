import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Search, ShieldCheck, GraduationCap, ArrowRight, 
  BadgeCheck, Lock, Globe, Zap, Users
} from 'lucide-react';

export default function PublicHome() {
  const [serial, setSerial] = useState('');
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  React.useEffect(() => {
    if (authenticated) {
      navigate('/dashboard');
    }
  }, [authenticated, navigate]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (serial.trim()) {
      navigate(`/verify/${encodeURIComponent(serial.trim())}`);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-40 -mr-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-40 -ml-40 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Navbar Minimal */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl tracking-tighter">AcademiVerify</span>
        </div>
        <div className="flex gap-8 items-center">
            {authenticated ? (
                <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            ) : (
                <>
                    <Link to="/login" className="text-white/40 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">Institutional Login</Link>
                    <Link to="/register" className="btn-primary !px-8">Get Started</Link>
                </>
            )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-bottom-4">
            <Zap size={12} className="animate-pulse" /> Decentrally Verified Academic Ledger
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
           True Academic <br/> 
           <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Verification.</span>
        </h1>
        
        <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          The global standard for instantly verifying academic identities, degrees, and professional certifications through a secure, institutional index.
        </p>

        {/* Verification Hub */}
        <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-1000">
          <form onSubmit={handleVerify} className="glass-card p-4 flex flex-col sm:flex-row gap-4 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-400 transition-colors" size={24} />
              <input 
                type="text" 
                value={serial}
                onChange={e => setSerial(e.target.value)}
                placeholder="Enter Document Serial / Hash" 
                className="w-full h-16 bg-transparent border-none focus:ring-0 pl-14 text-white font-black text-lg placeholder:text-white/10 placeholder:font-bold"
              />
            </div>
            <button type="submit" className="btn-primary h-16 !px-10 flex items-center justify-center gap-3 active:scale-95 group">
                Verify Document <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><Lock size={14}/> Encrypted</div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><ShieldCheck size={14}/> Instituional</div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"><Globe size={14}/> Global Reach</div>
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-10 max-w-7xl mx-auto py-24 border-t border-white/5">
        <div className="p-8 group hover:bg-white/5 rounded-3xl transition-all">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <BadgeCheck size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 tracking-tight">Instant Trust</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">Verification in seconds, not weeks. Our institutional ledger provides real-time validation results.</p>
        </div>
        <div className="p-8 group hover:bg-white/5 rounded-3xl transition-all">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <Users size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 tracking-tight">Alumni Network</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">A dedicated space for graduates to maintain their professional identities and verified credentials.</p>
        </div>
        <div className="p-8 group hover:bg-white/5 rounded-3xl transition-all">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-black mb-4 tracking-tight">Data Integrity</h3>
            <p className="text-white/30 text-sm leading-relaxed font-medium">Cryptographic protection ensures that every academic record remains immutable and verifiable.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-10 px-10 border-t border-white/5 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">© 2026 ACADEMIVERIFY. SECURING ACADEMIC FUTURES.</p>
        <div className="flex gap-8">
            <a href="#" className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Security Repo</a>
            <a href="#" className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Node</a>
            <a href="#" className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">API Keys</a>
        </div>
      </footer>
    </div>
  );
}

