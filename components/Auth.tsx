
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack?: () => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('Inventor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google && window.google.accounts && window.google.accounts.id) {
      const clientId = process.env.GOOGLE_CLIENT_ID; // Ensure this is set in your environment
      
      if (clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large', width: '100%' }
        );
      } else {
        console.warn("Google Client ID not found. OAuth button will not render.");
      }
    }
  }, [isLogin]); // Re-render button when mode changes just in case

  const handleGoogleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.loginWithGoogle(response.credential);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Google Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let user: User;
      if (isLogin) {
        user = await authService.login(email, password);
      } else {
        // Use provided name or derive from email if empty (fallback)
        const displayName = name.trim() || email.split('@')[0];
        user = await authService.register(displayName, email, password, role);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Search
        </button>
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-gavel text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">PatentiAI</h1>
          <p className="text-slate-400 mt-2">Intellectual Property Management Suite</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          {/* Google Login Section */}
          <div className="mb-6">
            <div ref={googleButtonRef} className="w-full flex justify-center h-[44px]"></div>
            {!process.env.GOOGLE_CLIENT_ID && (
               <div className="text-center text-[10px] text-slate-400 mt-2 italic">
                 Configure GOOGLE_CLIENT_ID to enable OAuth
               </div>
            )}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Access Role</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 transition"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value="Inventor">Inventor</option>
                    <option value="Attorney">Patent Attorney</option>
                    <option value="Admin">Legal Firm Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input 
                    type="text" required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="John Doe"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
              <input 
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
              <input 
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition mt-4 flex items-center justify-center gap-2 ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              } text-white`}
            >
              {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : (isLogin ? 'Sign In' : 'Get Started')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={toggleMode} className="text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-blue-600 font-bold hover:underline">{isLogin ? 'Sign Up' : 'Log In'}</span>
            </button>
          </div>
        </div>
        
        <div className="mt-10 text-center flex justify-center gap-6 text-slate-500 text-xs">
          <span>GDPR Compliant</span>
          <span>AES-256 Encrypted</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
