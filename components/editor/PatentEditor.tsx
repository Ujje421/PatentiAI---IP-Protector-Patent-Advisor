
import React, { useState } from 'react';
import { Project, Claim } from '../../types';
import { verifyLegalLanguage } from '../../services/ai/patentEngine';

interface PatentEditorProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

const PatentEditor: React.FC<PatentEditorProps> = ({ project, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'description' | 'abstract'>('claims');
  const [isVerifying, setIsVerifying] = useState(false);
  const [legalFlags, setLegalFlags] = useState<string[]>([]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const flags = await verifyLegalLanguage(project.draft.claims);
      setLegalFlags(flags);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex bg-slate-50 border-b border-slate-200">
          {['abstract', 'claims', 'description'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'claims' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Claim Set v{project.draft.version}</h3>
                <button 
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2"
                >
                  {isVerifying ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
                  Run Legal Verifier
                </button>
              </div>
              
              {project.draft.claims.map((claim, idx) => (
                <div key={claim.id} className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 group relative">
                  <div className="flex items-start gap-4">
                    <span className="text-slate-400 font-bold w-6">{idx + 1}.</span>
                    <div className="flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 block ${claim.type === 'Independent' ? 'text-blue-600' : 'text-slate-400'}`}>
                        {claim.type} Claim
                      </span>
                      <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-800 leading-relaxed min-h-[80px]"
                        defaultValue={claim.content}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'description' && (
            <textarea 
              className="w-full h-full p-4 bg-transparent border-none focus:ring-0 text-slate-800 leading-loose font-serif text-lg"
              defaultValue={project.draft.description}
            />
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Encrypted Session</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition">Save Version</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition">Export for Filing</button>
          </div>
        </div>
      </div>

      <div className="w-80 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fa-solid fa-microchip text-blue-500"></i>
            Legal Intelligence
          </h4>
          {legalFlags.length === 0 ? (
            <div className="py-8 text-center">
              <i className="fa-solid fa-circle-check text-slate-100 text-4xl mb-2"></i>
              <p className="text-[11px] text-slate-400">Run the verifier to check for antecedent basis errors or structural inconsistencies.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {legalFlags.map((flag, i) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
                  <p className="text-[11px] font-medium text-amber-900 leading-tight">{flag}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Collaboration</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">JD</div>
              <div>
                <p className="text-[11px] font-bold">Jane Doe (Law Firm)</p>
                <p className="text-[10px] text-slate-400">Modified Claim 1 logic.</p>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-800 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition">Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentEditor;
