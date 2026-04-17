import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, verifyAndRegister } from '../services/auth.service';
import { 
  User, Mail, Lock, ShieldCheck, 
  ArrowRight, ArrowLeft, RefreshCw, 
  GraduationCap, Briefcase, Eye, EyeOff,
  CheckCircle2, AlertCircle, Timer, Smartphone, Building2
} from 'lucide-react';

const ROLES = ['ALUMNI', 'EMPLOYER'];
const OTP_EXPIRY_SECONDS = 600; // 5 minutes

export default function Register() {
  const navigate = useNavigate();

  // Step 1 form fields
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [preferredMethod, setPreferredMethod] = useState('both');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState('ALUMNI');

  // Step 2 OTP
  const [step, setStep]         = useState(1); // 1 = form, 2 = OTP
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS);

  // UI state
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [showPass, setShowPass] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (step !== 2) return;
    setCountdown(OTP_EXPIRY_SECONDS);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Provide an email address.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Security policy requires at least 6 characters.'); return; }

    setLoading(true);
    try {
      await sendOtp({ email, preferredMethod: 'email' });
      setStep(2);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server took too long to dispatch the email.');
      } else {
        setError(err.response?.data?.error || 'Network error: Failed to reach the server. Please check if the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length < 6) { setError('Input all 6 verification digits.'); return; }
    if (countdown === 0)    { setError('OTP security window expired. Re-initialize.'); return; }

    setLoading(true);
    try {
      await verifyAndRegister({ email, otp: otpCode, username, password, role });
      setSuccess('Identity Verified. Initializing Login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server took too long to respond.');
      } else {
        setError(err.response?.data?.error || 'Verification failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      await sendOtp({ email, preferredMethod: 'email' });
      setCountdown(OTP_EXPIRY_SECONDS);
      setSuccess('New OTP injected into your inbox.');
      setTimeout(() => setSuccess(''), 6000);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server took too long to send the OTP.');
      } else {
        setError(err.response?.data?.error || 'Failed to resend OTP. Backend server unreachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg z-10">
        
        {/* Logo/Title Section */}
        <div className="text-center mb-10 fade-in">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6">
            <Building2 className="text-emerald-600" size={40} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Organization Access</h1>
          <p className="text-emerald-100 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Identity Registration</p>
        </div>

        {/* Multi-step indicator */}
        <div className="flex items-center justify-center gap-4 mb-8 px-10">
            <div className={`flex flex-col items-center gap-2 flex-1`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all duration-500 ${step >= 1 ? 'bg-white border-white text-emerald-600 shadow-md' : 'bg-transparent border-white/40 text-white/60'}`}>
                    {step > 1 ? <CheckCircle2 size={18} /> : '01'}
                </div>
                <span className={`text-[10px] uppercase font-black tracking-widest ${step >= 1 ? 'text-white' : 'text-white/60'}`}>Details</span>
            </div>
            <div className={`h-0.5 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/40'}`} />
            <div className={`flex flex-col items-center gap-2 flex-1`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all duration-500 ${step >= 2 ? 'bg-white border-white text-emerald-600 shadow-md' : 'bg-transparent border-white/40 text-white/60'}`}>
                    02
                </div>
                <span className={`text-[10px] uppercase font-black tracking-widest ${step >= 2 ? 'text-white' : 'text-white/60'}`}>Verify</span>
            </div>
        </div>

        {/* Main Form Card */}
        <div className="glass-card p-10 relative group overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
          
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-8 flex items-center gap-3">
              <AlertCircle className="text-red-500" size={18} />
              <p className="text-red-700 text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={18} />
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-tight">{success}</p>
            </div>
          )}

          {step === 1 ? (
             <form onSubmit={handleSendOtp} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Unique Username</label>
                        <div className="relative group/field">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={18} />
                            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="glass-input !pl-11 w-full" placeholder="e.g. digital_nomad" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Contact Email</label>
                        <div className="relative group/field">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={18} />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="glass-input !pl-11 w-full" placeholder="identity@domain.edu" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Assigned Context</label>
                        <div className="grid grid-cols-2 gap-4">
                            {ROLES.map(r => (
                                <button key={r} type="button" onClick={() => setRole(r)} className={`h-12 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${role === r ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
                                    {r === 'ALUMNI' ? <div className="flex items-center justify-center gap-2"><GraduationCap size={16}/> Alumni</div> : <div className="flex items-center justify-center gap-2"><Briefcase size={16}/> Employer</div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Access Key</label>
                            <div className="relative group/field">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={18} />
                                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value.trim())} className="glass-input !pl-11 !pr-11 w-full" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Confirm Key</label>
                            <div className="relative group/field">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-emerald-400 transition-colors" size={18} />
                                <input type={showPass ? 'text' : 'password'} required value={confirm} onChange={e => setConfirm(e.target.value.trim())} className="glass-input !pl-11 w-full" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-6 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <>Initialize Verification <ArrowRight size={20} strokeWidth={3} /></>}
                </button>
             </form>
          ) : (
            <div className="space-y-10 relative z-10 text-center animate-in zoom-in-95 duration-500">
                <div className="space-y-2">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-lg">
                        <Mail className="text-emerald-400" size={32} />
                    </div>
                    <p className="text-white font-black text-xl tracking-tight leading-none mb-2">Check Your Email</p>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2">
                        System signal sent to <span className="text-emerald-400">{email}</span>
                    </p>
                </div>

                <div className="flex justify-center gap-3">
                    {otp.map((digit, i) => (
                      <input key={i} id={`otp-${i}`} type="text" inputMode="numeric"
                        maxLength={1} value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className={`w-12 h-16 text-center text-3xl font-black rounded-xl border-2 transition-all outline-none ${digit ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/10 text-white focus:border-emerald-500'}`}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <div className={`px-5 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-inner ${countdown > 120 ? 'bg-white/5 text-emerald-400 border-white/10' : 'bg-rose-500/20 text-rose-400 border-rose-500/20 animate-pulse'}`}>
                        <Timer size={16} strokeWidth={3} /> Expiring In: {formatTime(countdown)}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <button onClick={handleVerify} disabled={loading || otp.join('').length < 6} className="btn-primary w-full py-4 text-sm tracking-widest uppercase">
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Finalize Registration'}
                    </button>
                    
                    <div className="flex justify-between items-center px-4">
                        <button onClick={() => setStep(1)} className="text-white/30 hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
                            <ArrowLeft size={16} /> Edit Data
                        </button>
                        <button onClick={handleResend} disabled={loading || countdown > 240} className={`font-black text-[10px] uppercase tracking-widest transition-all ${countdown <= 240 ? 'text-emerald-400 hover:text-white' : 'text-white/10'}`}>
                            Resend Signal
                        </button>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <p className="text-center mt-10 text-white text-sm font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-white hover:text-emerald-100 transition-colors underline decoration-2 underline-offset-4 font-bold">
                Access Node
            </Link>
        </p>
      </div>
    </div>
  );
}
