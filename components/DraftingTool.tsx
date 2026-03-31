
import React, { useState } from 'react';
import { Project } from '../types';

interface DraftingToolProps {
  project: Project;
}

const DraftingTool: React.FC<DraftingToolProps> = ({ project }) => {
  const { draft } = project;
  const [activeTab, setActiveTab] = useState<'abstract' | 'claims' | 'description'>('claims');

  if (!draft) return <div className="p-20 text-center">Draft not generated. Go back and generate it first.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[700px]">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('abstract')}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition ${activeTab === 'abstract' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Abstract
          </button>
          <button 
            onClick={() => setActiveTab('claims')}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition ${activeTab === 'claims' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Claims
          </button>
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Detailed Description
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'abstract' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Patent Abstract</h3>
              <textarea 
                className="w-full h-96 p-6 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                defaultValue={draft.abstract}
              />
            </div>
          )}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Formal Claims List</h3>
              <div className="space-y-4">
                {draft.claims.map((claim, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl group relative">
                    <span className="font-bold text-slate-400 w-8">{i + 1}.</span>
                    <textarea 
                      className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-slate-800 leading-relaxed h-20"
                      defaultValue={claim.content}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button className="p-1 hover:bg-white rounded text-blue-600" title="Suggest improvements"><i className="fa-solid fa-wand-magic-sparkles"></i></button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-400 transition font-medium">
                + Add Dependent Claim
              </button>
            </div>
          )}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Detailed Technical Description</h3>
              <textarea 
                className="w-full h-[600px] p-6 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                defaultValue={draft.description}
              />
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="text-xs text-slate-400">Auto-saved 2 mins ago</div>
          <div className="flex gap-3">
             <button className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition">Export PDF</button>
             <button className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition">Submit to Attorney Review</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-scale-balanced text-amber-500"></i>
            Legal Language Verification
          </h3>
          <div className="space-y-3">
            {draft.legalFlags.map((flag, i) => (
              <div key={i} className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
                <p className="text-[11px] font-medium text-amber-800 leading-tight">{flag}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="font-bold text-lg mb-4">Law Firm Export</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">Prepare this draft for submission to a designated IP law firm. This will convert the document into USPTO standard XML format.</p>
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 mb-3">
            <i className="fa-solid fa-file-code"></i> Download .XML (USPTO)
          </button>
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
            <i className="fa-solid fa-paper-plane"></i> Send to Law Firm API
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Draft Activity</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">AI</div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">PatentiAI System</p>
                <p className="text-[10px] text-slate-400">Generated initial claims draft</p>
                <p className="text-[9px] text-slate-300">Today, 10:45 AM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">JD</div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">Jane Doe (You)</p>
                <p className="text-[10px] text-slate-400">Revised abstract section</p>
                <p className="text-[9px] text-slate-300">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftingTool;
