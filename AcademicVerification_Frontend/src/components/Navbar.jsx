import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import NotificationPanel from './NotificationPanel';
import { 
  LayoutDashboard, Users, UserCheck, GraduationCap, 
  UserCircle, LogOut, Search, Menu, X, Database 
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItem = (path, icon, label) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)} 
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
          isActive 
            ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(255,255,255,0.1)] border border-white/20' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <span className={isActive ? 'text-emerald-400' : ''}>{icon}</span>
        <span className="text-sm tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex justify-between items-center transition-all">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white leading-none">
                AcademiVerify
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400/80 mt-1">
                Verified Excellence
              </span>
            </div>
          </div>

          {/* Nav Links */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2">
              {navItem('/dashboard', <LayoutDashboard size={18} />, 'Dashboard')}
              {user?.role === 'ADMIN' && navItem('/students', <Users size={18} />, 'Students')}
              {user?.role === 'ADMIN' && navItem('/audit', <Database size={18} />, 'System Ledger')}
              {navItem('/alumni', <UserCheck size={18} />, 'Alumni Records')}
              {navItem('/verifications', <Search size={18} />, 'Verifications')}
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <NotificationPanel />
                
                <div className="h-10 w-px bg-white/10 mx-2 hidden md:block"></div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/profile')}
                    className={`flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl transition-all border border-transparent ${
                      location.pathname === '/profile' 
                        ? 'bg-white/10 border-white/20 shadow-lg' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <UserCircle size={24} />
                    </div>
                    <div className="hidden xl:flex flex-col items-start">
                      <span className="text-sm font-bold text-white leading-none capitalize">{user?.username}</span>
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">{user?.role}</span>
                    </div>
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 transition-all border border-white/10 hover:border-rose-500/30 group"
                    title="Logout"
                  >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                  </button>
                </div>
              </>
            )}
            {/* Mobile Toggle */}
            {isAuthenticated && (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 rounded-2xl bg-white/5 text-white/70 hover:text-white border border-white/10"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="lg:hidden mt-4 glass-card border-white/10 p-6 animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-4">
              <MobileNavItem path="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
              {user?.role === 'ADMIN' && <MobileNavItem path="/students" icon={<Users size={20} />} label="Students" onClick={() => setIsMobileMenuOpen(false)} />}
              {user?.role === 'ADMIN' && <MobileNavItem path="/audit" icon={<Database size={20} />} label="System Ledger" onClick={() => setIsMobileMenuOpen(false)} />}
              <MobileNavItem path="/alumni" icon={<UserCheck size={20} />} label="Alumni" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavItem path="/verifications" icon={<Search size={20} />} label="Verifications" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="h-px bg-white/5 my-2" />
              <MobileNavItem path="/profile" icon={<UserCircle size={20} />} label="My Profile" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const MobileNavItem = ({ path, icon, label, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <button 
      onClick={() => { navigate(path); onClick(); }}
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all w-full text-left ${
        isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="tracking-widest uppercase text-[10px]">{label}</span>
    </button>
  );
};

export default Navbar;
