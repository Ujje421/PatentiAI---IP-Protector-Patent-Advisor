
import React from 'react';
import { View, User } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout, user }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'fa-grid-2', role: 'All' },
    { id: View.ANALYSIS, label: 'Analysis', icon: 'fa-microscope', role: 'All' },
    { id: View.DRAFTING, label: 'Drafting', icon: 'fa-pen-nib', role: 'All' },
    { id: View.SEARCH, label: 'Patent Search', icon: 'fa-magnifying-glass', role: 'All' },
    { id: View.MONITORING, label: 'IP Alerts', icon: 'fa-bell', role: 'All' },
    { id: View.COLLABORATION, label: 'Teams', icon: 'fa-users', role: 'Legal Team' },
    { id: View.AUDIT_LOGS, label: 'Compliance', icon: 'fa-shield-halved', role: 'Admin' },
  ];

  return (
    <aside className="w-72 bg-white flex flex-col border-r border-slate-200 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] z-50">
      <div className="p-8 pb-12 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
          <i className="fa-solid fa-gavel text-white text-xl"></i>
        </div>
        <div>
          <span className="text-2xl font-black tracking-tighter block leading-none text-slate-900">PatentiAI</span>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1 block">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Core Platform</p>
        {menuItems.filter(i => i.role === 'All' || i.role === user.role || user.role === 'Admin').map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
          >
            Terminate Session
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
