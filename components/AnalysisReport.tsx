
import React from 'react';
import { Project } from '../types';
import DiagramView from './DiagramView';

interface AnalysisReportProps {
  project: Project;
  onGenerateDraft: () => void;
  isLoadingDraft: boolean;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ project, onGenerateDraft, isLoadingDraft }) => {
  const { invention, priorArt } = project;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8 pb-20">
        {/* Technical Flowchart */}
        {invention.flowchartCode && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-sitemap text-blue-500"></i>
                AI Architecture Projection
              </h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">Download SVG</button>
            </div>
            <div className="p-8 bg-slate-50">
               <DiagramView code={invention.flowchartCode} />
            </div>
          </div>
        )}

        {/* Core Analysis */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Technical Analysis</h2>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {invention.classification}
            </span>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Technical Summary</h3>
              <p className="text-slate-800 leading-relaxed text-lg font-medium">{invention.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {invention.keywords?.map((k, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Missing Details</h3>
                <ul className="space-y-2">
                  {invention.missingDetails?.map((d, i) => (
                    <li key={i} className="text-slate-600 text-sm flex gap-2">
                      <i className="fa-solid fa-circle-exclamation text-amber-500 mt-0.5"></i>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Prior Art */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Global Prior Art Analysis</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {priorArt.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No conflicting patents found in immediate vicinity.</div>
            ) : (
              priorArt.map((art, i) => (
                <div key={i} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 hover:text-blue-600 transition underline decoration-blue-100 underline-offset-4">
                      <a href={art.uri} target="_blank" rel="noopener noreferrer">{art.title}</a>
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      art.relevance === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>RELEVANCE: {art.relevance}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{art.snippet}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 sticky top-8 h-fit">
        {/* Novelty Score Widget */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Novelty Rating</h3>
          <div className="relative inline-block mb-4">
             <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - (invention.noveltyScore || 0) / 100)} className={`${invention.noveltyScore! > 80 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000`} />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-4xl font-black text-slate-900">{invention.noveltyScore}%</span>
             </div>
          </div>
          <p className="text-xs text-slate-400">Similarity index calculated via Semantic Vector Search.</p>
        </div>

        {/* Action Call */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="font-bold text-lg mb-4">Next Filing Step</h3>
          <p className="text-xs text-slate-400 mb-6">Based on the {invention.noveltyScore}% score, our advisor recommends proceeding to a provisional utility draft.</p>
          <button 
            onClick={onGenerateDraft}
            disabled={isLoadingDraft}
            className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
              isLoadingDraft ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98]'
            }`}
          >
            {isLoadingDraft ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-pen-nib"></i>}
            Draft Full Patent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
