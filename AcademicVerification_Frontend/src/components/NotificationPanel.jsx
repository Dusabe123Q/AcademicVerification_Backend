import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Check, Clock, Info, ShieldCheck, X, Sparkles, ExternalLink } from 'lucide-react';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Core Logic Failure (Notifications):', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Sync Failure:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Batch Sync Failure:', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl transition-all duration-300 border ${
            isOpen ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 rotate-12 scale-110' : 
            'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/10'
        }`}
      >
        <Bell size={20} strokeWidth={2.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black">{unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-6 w-96 glass-card overflow-hidden z-50 animate-in slide-in-from-top-5 fade-in duration-300 border-white/20 shadow-2xl">
            <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                  <Sparkles size={80} />
              </div>
              
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">Activity Stream</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Synced: {unreadCount} Priority Items</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="mt-6 w-full py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10"
                >
                  Synchronize All as Read
                </button>
              )}
            </div>
            
            <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-6 flex gap-5 hover:bg-white/5 transition-all group/row ${!n.isRead ? 'bg-emerald-500/5' : ''}`}
                    >
                      <div className={`mt-1 h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center border transition-transform group-hover/row:scale-110 ${
                        n.message.toLowerCase().includes('approved') ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        n.message.toLowerCase().includes('profile') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-white/10 text-white/40 border-white/10'
                      }`}>
                        {n.message.toLowerCase().includes('approved') ? <ShieldCheck size={22} /> :
                         n.message.toLowerCase().includes('profile') ? <Info size={22} /> :
                         <Bell size={22} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed tracking-tight ${!n.isRead ? 'font-black text-white' : 'font-medium text-white/40'}`}>
                          {n.message}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center">
                            <Clock size={12} className="mr-2 text-emerald-400" /> 
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                          {!n.isRead && (
                            <button 
                              onClick={() => markAsRead(n.id)}
                              className="text-[10px] font-black text-emerald-400 hover:text-white uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                <span className="w-1 h-1 bg-emerald-500 rounded-full group-hover/btn:scale-[300%] transition-transform"></span>
                                Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/5 mb-6 border border-white/5 animate-pulse">
                      <Bell size={40} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-black text-white/60 tracking-tighter mb-1">Silence in the Node</h3>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">No recent synchronization events recorded.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-center group/footer cursor-pointer">
              <button className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] group-hover/footer:text-emerald-400 transition-colors flex items-center gap-3">
                Full Audit History <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
