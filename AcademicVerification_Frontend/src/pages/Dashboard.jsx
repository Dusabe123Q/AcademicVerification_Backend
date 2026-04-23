import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import {
  Users, FileText, CheckCircle, Search,
  TrendingUp, Activity, BarChart3, PieChart
} from 'lucide-react';

// ── Tiny SVG Bar Chart ────────────────────────────────────────────────────────
const BarChart = ({ data, color }) => {
  if (!data || data.length === 0) return <p className="text-white/40 text-sm text-center py-4 italic">No data available</p>;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-3 h-32 w-full px-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 group">
          <div
            className="w-full rounded-t-lg transition-all duration-1000 ease-out hover:brightness-125 hover:shadow-lg hover:shadow-emerald-500/20"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: `linear-gradient(to top, ${color}cc, ${color})`,
              minHeight: d.value > 0 ? 4 : 0
            }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter mt-2 group-hover:text-white/60 transition-colors">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Tiny Donut Chart ──────────────────────────────────────────────────────────
const DonutChart = ({ approved, pending, rejected }) => {
  const total = approved + pending + rejected || 1;
  const size = 140;
  const r = 50;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { value: approved, color: '#4ade80', label: 'Approved' },
    { value: pending, color: '#fbbf24', label: 'Pending' },
    { value: rejected, color: '#f87171', label: 'Rejected' },
  ];

  let offset = 0;
  const arcs = segments.map(s => {
    const dash = (s.value / total) * circumference;
    const gap = circumference - dash;
    const arc = { ...s, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
          {arcs.map((arc, i) => arc.value > 0 && (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth="16" strokeLinecap="round"
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{total}</span>
          <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Total</span>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: s.color, color: s.color }} />
            <span className="text-[11px] font-bold text-white/60 tracking-wide uppercase">{s.label}</span>
            <span className="text-[11px] font-black text-white ml-1">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: IconComponent, label, value, color, onClick, trend }) => {
  const Icon = IconComponent;
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 ${onClick ? 'cursor-pointer hover:bg-white/10 active:scale-95' : ''} transition-all duration-300 relative group overflow-hidden`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 scale-50 group-hover:scale-125`}
        style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white leading-none tracking-tight">{value}</span>
            {trend && <span className="text-[10px] font-bold text-green-400/80 bg-green-400/10 px-1.5 py-0.5 rounded-md">{trend}</span>}
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/80 group-hover:text-white transition-colors group-hover:border-white/20 shadow-inner">
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

// ── Quick Action Card ─────────────────────────────────────────────────────────
const QuickCard = ({ icon: IconComponent, title, desc, color, onClick }) => {
  const Icon = IconComponent;
  const palette = {
    emerald: 'from-emerald-500 to-emerald-600',
    teal: 'from-teal-500 to-teal-600',
  };
  return (
    <div onClick={onClick}
      className="glass-card p-8 cursor-pointer hover:bg-white/10 group transition-all duration-500 active:scale-95 border border-white/5 hover:border-white/20">
      <div className={`w-14 h-14 bg-gradient-to-br ${palette[color]} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <h2 className="text-xl font-black text-white mb-2 tracking-tight">{title}</h2>
      <p className="text-white/50 text-sm leading-relaxed mb-6 font-medium">{desc}</p>
      <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
        Access Module <span className="text-lg leading-none">→</span>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    alumniCount: 0, verificationCount: 0, credentialCount: 0,
    approved: 0, pending: 0, rejected: 0,
    byYear: []
  });
  const [loading, setLoading] = useState(true);

  const getUsername = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'User';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || 'User';
    } catch { return 'User'; }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [alumniRes, verifRes, credRes] = await Promise.all([
          api.get('/alumni').catch(() => ({ data: [] })),
          api.get('/verification').catch(() => ({ data: [] })),
          api.get('/credentials').catch(() => ({ data: [] })),
        ]);

        const verifs = verifRes.data || [];
        const alumni = alumniRes.data || [];

        const approved = verifs.filter(v => v.status === 'APPROVED').length;
        const pending = verifs.filter(v => v.status === 'PENDING').length;
        const rejected = verifs.filter(v => v.status === 'REJECTED').length;

        const yearMap = {};
        alumni.forEach(a => {
          if (a.grad_year) yearMap[a.grad_year] = (yearMap[a.grad_year] || 0) + 1;
        });
        const byYear = Object.entries(yearMap)
          .sort(([a], [b]) => Number(a) - Number(b))
          .slice(-6)
          .map(([label, value]) => ({ label, value }));

        setStats({
          alumniCount: alumni.length,
          verificationCount: verifs.length,
          credentialCount: (credRes.data || []).length,
          approved, pending, rejected, byYear
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const username = getUsername();

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin shadow-lg" />
      <span className="text-white/40 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Initializing Dashboard</span>
    </div>
  );

  return (
    <div className="pb-12 fade-in">

      {/* Welcome Banner */}
      <div className="glass-card p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-colors duration-1000" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 rounded-3xl shadow-2xl flex items-center justify-center text-4xl font-black text-white border border-white/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black tracking-tighter text-white">
                {role === 'ROLE_ALUMNI' ? `Welcome Home, ${username}` : `Hello Manager, ${username}!`}
              </h1>
              <div className="bg-green-500/20 text-green-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1.5 uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Identity Secured
              </div>
            </div>
            <p className="text-white/40 text-lg font-medium tracking-tight">
              {role === 'ROLE_ALUMNI'
                ? "Your official institutional record is verified and active."
                : "Institutional master nodes are synchronized and online."}
            </p>
          </div>
        </div>
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/10 shadow-inner flex-1 md:flex-none text-center">
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Access Tier</p>
            <p className="text-2xl font-black text-emerald-400 leading-none">{role ? role.replace('ROLE_', '') : 'User'}</p>
          </div>
          <div className="bg-white/5 p-5 rounded-3xl border border-white/10 shadow-inner flex-1 md:flex-none text-center">
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Status</p>
            <p className="text-2xl font-black text-teal-400 leading-none">Verified</p>
          </div>
        </div>
      </div>

      {role === 'ROLE_ALUMNI' ? (
        <>
          {/* Alumni Specific Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <StatCard icon={CheckCircle} label="Personal Verifications" value={stats.verificationCount} color="#10b981" onClick={() => navigate('/verifications')} trend="Institutional" />
            <StatCard icon={BarChart3} label="Career Experience" value={stats.byYear.length} color="#059669" onClick={() => navigate('/profile')} trend="Milestones" />
            <StatCard icon={Activity} label="System Health" value="100%" color="#22c55e" trend="Peak" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QuickCard
              icon={Users} title="Manage Professional ID"
              desc="Update your career history, certificates, and institutional metadata to maintain a verified professional presence."
              color="emerald" onClick={() => navigate('/profile')}
            />
            <QuickCard
              icon={Search} title="Verification Center"
              desc="Direct access to your cryptographic verification history. Share your official node links with external verifiers."
              color="teal" onClick={() => navigate('/verifications')}
            />
          </div>
        </>
      ) : (
        <>
          {/* Admin Specific Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard icon={Users} label="Registered Alumni" value={stats.alumniCount} color="#10b981" onClick={() => navigate('/alumni')} trend="+12%" />
            <StatCard icon={FileText} label="Digital Credentials" value={stats.credentialCount} color="#059669" trend="Secured" />
            <StatCard icon={Search} label="Verif. Requests" value={stats.verificationCount} color="#0ea5e9" onClick={() => navigate('/verifications')} trend="Global" />
            <StatCard icon={CheckCircle} label="Success Rate" value={`${stats.verificationCount > 0 ? Math.round((stats.approved / stats.verificationCount) * 100) : 100}%`} color="#22c55e" trend="Verified" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Growth Trend</h2>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Alumni by Graduation Year</p>
                  </div>
                </div>
                <TrendingUp className="text-green-400/50" />
              </div>
              <BarChart data={stats.byYear} color="#10b981" />
            </div>

            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-teal-400 border border-white/10">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Verification Mix</h2>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Global Status Summary</p>
                  </div>
                </div>
                <Activity className="text-teal-400/50" />
              </div>
              <DonutChart approved={stats.approved} pending={stats.pending} rejected={stats.rejected} />
            </div>
          </div>
        </>
      )}

      {/* ── Quick Actions Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <QuickCard
          icon={Users} title="Alumni Network"
          desc="Explore our global database of graduates. Manage profiles, track employment history and academic success."
          color="emerald" onClick={() => navigate('/alumni')}
        />
        <QuickCard
          icon={Search} title="Deep Verification"
          desc="Initiate official credential verification requests. Automated check against university master records."
          color="teal" onClick={() => navigate('/verifications')}
        />
        <div className="glass-card p-8 border border-white/5 opacity-80 bg-black/20">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 border border-white/5 mb-6">
            <Activity size={28} />
          </div>
          <h2 className="text-xl font-black text-white/20 mb-2 tracking-tight">Privacy Vault</h2>
          <p className="text-white/10 text-sm leading-relaxed mb-6 font-medium italic">High-security module locked for current release. Advanced encryption patterns active.</p>
          <div className="text-white/10 font-bold text-[10px] uppercase tracking-[0.4em]">Restricted Access</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
