
import React, { useState, useEffect } from 'react';
import { View, Project, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventionForm from './components/InventionForm';
import AnalysisReport from './components/AnalysisReport';
import PatentEditor from './components/editor/PatentEditor';
import ChatBot from './components/ChatBot';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { analyzeInvention, searchPriorArt } from './services/geminiService';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Initialize Auth Session
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setAuthInitialized(true);
  }, []);

  // Load Projects from persistence (Mock DB)
  useEffect(() => {
    const savedProjects = localStorage.getItem('patentiai_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  // Save Projects to persistence
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('patentiai_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const handleLogin = (u: User) => {
    setUser(u);
    setShowAuth(false);
  };
  
  const handleLogout = () => { 
    authService.logout();
    setUser(null); 
    setCurrentView(View.DASHBOARD);
  };

  const handleNewProjectSubmit = async (desc: string) => {
    setIsProcessing(true);
    try {
      const analysis = await analyzeInvention(desc);
      const priorArt = await searchPriorArt(analysis);
      
      const newPrj: Project = {
        id: `PRJ-${Date.now()}`,
        organizationId: user?.organizationId || 'ORG-1',
        invention: { 
          ...analysis, 
          id: `INV-${Date.now()}`, 
          description: desc,
          riskFlags: [] 
        },
        draft: {
          id: `DFT-${Date.now()}`,
          abstract: '',
          claims: [],
          description: '',
          figures: [],
          status: 'Draft',
          version: 1,
          legalFlags: []
        },
        priorArt,
        tasks: [],
        auditLogs: [{ id: 'L1', timestamp: new Date().toISOString(), userId: user?.id || 'U1', action: 'Project Created', resourceId: 'PRJ', ipAddress: '127.0.0.1' }],
        status: 'Draft'
      };

      setProjects(prev => [newPrj, ...prev]);
      setCurrentProject(newPrj);
      setCurrentView(View.ANALYSIS);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authInitialized) {
    return <div className="min-h-screen bg-slate-900"></div>; // Loading state
  }

  // State 1: User is logged in -> Show Dashboard
  if (user) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F1F3F6]">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          onLogout={handleLogout} 
          user={user} 
        />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-950 tracking-tighter">
                {currentView.replace('_', ' ')}
              </h1>
              <p className="text-slate-500 font-medium">{currentProject?.invention.title || 'Enterprise Management'}</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 Secure Node Active
               </div>
               {currentProject && (
                 <button onClick={() => setCurrentProject(null)} className="text-slate-400 hover:text-slate-600 transition">
                   <i className="fa-solid fa-circle-xmark text-2xl"></i>
                 </button>
               )}
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {currentView === View.DASHBOARD && (
              <Dashboard 
                projects={projects} 
                onSelectProject={(p) => { setCurrentProject(p); setCurrentView(View.ANALYSIS); }} 
                onNewProject={() => { setCurrentProject(null); setCurrentView(View.ANALYSIS); }}
              />
            )}

            {currentView === View.ANALYSIS && !currentProject && (
              <InventionForm onSubmit={handleNewProjectSubmit} isLoading={isProcessing} />
            )}

            {currentView === View.ANALYSIS && currentProject && (
              <AnalysisReport 
                project={currentProject} 
                onGenerateDraft={() => setCurrentView(View.DRAFTING)} 
                isLoadingDraft={isProcessing} 
              />
            )}

            {currentView === View.DRAFTING && currentProject && (
              <PatentEditor project={currentProject} onUpdate={(p) => setProjects(projects.map(prj => prj.id === p.id ? p : prj))} />
            )}
            
            {currentView === View.AUDIT_LOGS && (
               <div className="bg-white rounded-3xl p-8 border border-slate-200">
                 <h2 className="text-xl font-black mb-6">Access Audit Trails</h2>
                 <div className="space-y-2">
                   {projects.flatMap(p => p.auditLogs).map(log => (
                     <div key={log.id} className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[10px]">
                       <span className="text-slate-400">{log.timestamp}</span>
                       <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">ACTION: {log.action}</span>
                       <span className="text-slate-900 font-bold">USER_ID: {log.userId}</span>
                       <span className="ml-auto text-slate-300">IP: {log.ipAddress}</span>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>

          {isProcessing && (
             <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center">
               <div className="text-center">
                  <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-2xl shadow-blue-500/20"></div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Neural Engine Processing</h3>
                  <p className="text-blue-200 mt-2 font-medium">Encrypting transmission and scanning global data vectors...</p>
               </div>
             </div>
          )}

          <ChatBot currentProject={currentProject} />
        </main>
      </div>
    );
  }

  // State 2: User requests Auth from Landing
  if (showAuth) {
    return <Auth onLogin={handleLogin} onBack={() => setShowAuth(false)} />;
  }

  // State 3: Default Landing Page (Public)
  return <LandingPage onAuthRequest={() => setShowAuth(true)} />;
};

export default App;
