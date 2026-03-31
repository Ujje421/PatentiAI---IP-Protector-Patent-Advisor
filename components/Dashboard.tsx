
import React from 'react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onNewProject: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active IP', value: projects.length, icon: 'fa-folder-tree', color: 'blue' },
          { label: 'In Review', value: '12', icon: 'fa-scale-balanced', color: 'amber' },
          { label: 'Risk Score', value: '4.2', icon: 'fa-shield-heart', color: 'emerald' },
          { label: 'Alerts', value: '3', icon: 'fa-bolt', color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center mb-4`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Intellectual Portfolio</h2>
            <button onClick={onNewProject} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
              New Invention Disclosure
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Asset Name</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Security Level</th>
                <th className="px-8 py-4">Risk Rating</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p.id} onClick={() => onSelectProject(p)} className="hover:bg-slate-50 transition cursor-pointer group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-900">{p.invention.title}</p>
                    <p className="text-[10px] text-slate-400">{p.invention.classification}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i < 3 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-black text-slate-700">{p.invention.noveltyScore}%</span>
                       <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500" style={{ width: `${p.invention.noveltyScore}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-80 space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 text-white">
            <h4 className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">System Monitoring</h4>
            <div className="space-y-6">
              {[
                { label: 'Blockchain Sync', status: 'Active', color: 'emerald' },
                { label: 'USPTO Bridge', status: 'Idle', color: 'slate' },
                { label: 'Audit Logging', status: 'Secure', color: 'blue' }
              ].map((sys, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">{sys.label}</span>
                  <span className={`text-[10px] font-black text-${sys.color}-400 uppercase tracking-widest`}>{sys.status}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-widest mb-4">Audit Activity</h4>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-900 leading-none">Security Access</p>
                    <p className="text-[9px] text-slate-400 mt-1">Resource: Invention_PRJ_847</p>
                    <p className="text-[8px] text-slate-300 font-mono mt-0.5">IP: 192.168.1.45</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
