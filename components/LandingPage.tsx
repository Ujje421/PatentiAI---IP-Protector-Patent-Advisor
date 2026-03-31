
import React, { useState } from 'react';
import { performPublicSearch } from '../services/geminiService';
import { PublicSearchResult } from '../types';

interface LandingPageProps {
  onAuthRequest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthRequest }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<PublicSearchResult | null>(null);

  const suggestions = [
    "A biodegradable coffee cup that seeds plants",
    "AI-powered drone for automated window cleaning",
    "Smart contact lenses for glucose monitoring",
    "Blockchain-based voting system for HOAs"
  ];

  const handleSearch = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const searchQuery = typeof e === 'string' ? e : query;
    
    if (!searchQuery.trim()) return;
    if (typeof e === 'string') setQuery(e);

    setIsSearching(true);
    setResult(null); // Reset previous results
    try {
      const data = await performPublicSearch(searchQuery);
      setResult(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="flex justify-between items-center p-6 lg:px-12 sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setResult(null)}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-gavel text-white text-lg"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">PatentiAI</span>
        </div>
        <button 
          onClick={onAuthRequest}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-95"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 lg:p-12 max-w-5xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className={`text-center transition-all duration-700 ease-out ${result || isSearching ? 'mt-0 mb-8 opacity-100 scale-100' : 'mt-20 mb-10'}`}>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Is your idea <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">patentable?</span>
          </h1>
          <p className={`text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto transition-opacity duration-500 ${result ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            Instant prior art search and novelty assessment powered by Gemini 2.0 Flash.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-3xl relative z-20">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500 ${isSearching ? 'animate-pulse' : ''}`}></div>
              <div className="relative bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 flex items-center overflow-hidden transition-shadow focus-within:shadow-2xl focus-within:shadow-blue-900/10">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                  placeholder="Describe your invention here..."
                  className="w-full p-6 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent min-h-[80px]"
                  rows={result ? 1 : 2}
                  disabled={isSearching}
                />
                <button 
                  type="submit" 
                  disabled={isSearching || !query.trim()}
                  className={`mr-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    query.trim() && !isSearching ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-arrow-up"></i>}
                </button>
              </div>
            </div>
          </form>

          {/* Suggestions */}
          {!result && !isSearching && (
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="w-full max-w-5xl mt-12 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Prior Art Column (Left) */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-none">Prior Art Found</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Sources from Google Search</p>
                    </div>
                  </div>
                  
                  {result.existingPatents.length > 0 ? (
                     <div className="space-y-3">
                       {result.existingPatents.map((p, i) => (
                         <a key={i} href={p.uri} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition group relative overflow-hidden">
                           <div className="flex justify-between items-start gap-3">
                             <div>
                               <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 line-clamp-2 leading-snug">{p.title}</h4>
                               <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">{p.uri}</p>
                             </div>
                             <i className="fa-solid fa-external-link-alt text-xs text-slate-300 group-hover:text-blue-400 mt-1"></i>
                           </div>
                         </a>
                       ))}
                     </div>
                  ) : (
                    <div className="text-center py-10">
                       <i className="fa-solid fa-check-circle text-emerald-500 text-3xl mb-3"></i>
                       <p className="text-slate-600 font-bold">No exact matches found.</p>
                       <p className="text-slate-400 text-xs mt-1">Your idea appears to be unique based on our quick search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advice Column (Right) */}
              <div className="md:col-span-7 space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-32 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold">AI Assessment</h3>
                      <p className="text-slate-400 text-xs mt-1">Preliminary patentability check</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg ${
                      result.noveltyEstimate.toLowerCase().includes('high') ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                      result.noveltyEstimate.toLowerCase().includes('medium') ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'
                    }`}>
                      {result.noveltyEstimate} Novelty
                    </span>
                  </div>

                  <div className="space-y-5 relative z-10">
                    {result.advice.map((tip, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700 text-blue-400 text-xs">
                           <i className="fa-solid fa-lightbulb"></i>
                        </div>
                        <p className="text-sm font-medium text-slate-300 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-xl text-white flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <h3 className="font-bold text-2xl mb-2 relative z-10">Ready to patent this?</h3>
                  <p className="text-blue-100 text-sm mb-6 max-w-md relative z-10">Use our AI Drafting Tool to generate formal claims, descriptions, and file your provisional patent application today.</p>
                  <button 
                    onClick={onAuthRequest}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 hover:scale-105 transition w-full md:w-auto shadow-lg relative z-10 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-rocket"></i>
                    Start Full Project
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-400 text-xs">
        <p>&copy; 2024 PatentiAI. Powered by Google Gemini 2.0.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
