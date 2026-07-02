// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import PortfolioCMS from '../components/PortfolioCMS';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    // Attempt to pull current JSON layout from database endpoint
    fetch('/api/get-portfolio')
      .then((res) => {
        if (!res.ok) throw new Error("Database offline");
        return res.json();
      })
      .then((data) => {
        setPortfolioData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Using localized template state values:", err);
        // Fallback placeholder scheme prevents failure loops
        setPortfolioData({
          profile: { name: "Salman Raza", role: "Senior QA Automation Architect", bio: "Engineering scalable parallel end-to-end framework layers." },
          skills: [{ name: "Playwright", category: "UI Automation", description: "Parallel runner matrices." }],
          experience: [{ id: "1", role: "Lead Engineer", company: "QAOps Core Hub", duration: "2024 - Present", description: "Isolating runtime browser driver threads." }],
          projects: []
        });
        setIsLoading(false);
      });

    const savedToken = localStorage.getItem('admin_secure_session');
    if (savedToken && savedToken === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  }, []);

  // Keyboard shortcut listener (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAuthModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAuthVerify = () => {
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAuthModal(false);
      localStorage.setItem('admin_secure_session', passwordInput);
      alert("Terminal Verified: Access Token Unlocked.");
    } else {
      alert("Access Denied: Inoperable credential string.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPasswordInput('');
    localStorage.removeItem('admin_secure_session');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-gray-500 font-mono text-xs">
        <span>// Initializing secure QAOps portfolio runtime streams...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-screen relative overflow-hidden">
      <Head>
        <title>{portfolioData?.profile?.name || "JimmyOps"} | Automation Portfolio</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* Global Background Depth Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-black z-0 pointer-events-none"></div>

      {/* Embedded Floating Navigation Menu Bar Header */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-gray-800/80 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold tracking-wider text-white flex items-center gap-1.5">
            🛡️ {portfolioData?.profile?.name?.toUpperCase() || "JIMMYOPS"} <span className="text-cyan-400 text-xxs font-normal">CORE</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <button onClick={handleLogout} className="text-xxs font-mono bg-red-950/60 hover:bg-red-900/80 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/50 transition-colors">
              Exit Session Gate
            </button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="text-xxs font-mono text-slate-500 hover:text-slate-400 transition-colors">
              🔒 Secure Shell
            </button>
          )}
        </div>
      </nav>

      {/* Render Master Portfolio Surface Layer Elements */}
      <div className="relative z-10">
        <PortfolioCMS 
          initialData={portfolioData} 
          token={passwordInput || localStorage.getItem('admin_secure_session')} 
          forceAdminView={isAdmin} 
        />
      </div>

      {/* Hidden Terminal Authentication Modal Overlay Prompt */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl animate-fade-in">
            <div>
              <h3 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">🔑 Authentication Console</h3>
              <p className="text-gray-400 text-xxs mt-0.5">Input secure environment configuration token keys.</p>
            </div>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter server payload key..." 
              className="w-full bg-black border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-600 shadow-inner"
            />
            <div className="flex justify-end gap-2 text-xxs font-mono font-bold uppercase tracking-wider">
              <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-gray-300 px-4 py-2 rounded-lg transition-colors">Close</button>
              <button onClick={handleAuthVerify} className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-all shadow-md">Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}