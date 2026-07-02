// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import PortfolioCMS from '../components/PortfolioCMS'; // This renders your original CMS inputs

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [portfolioData, setPortfolioData] = useState(null);

  // 1. Fetch initial portfolio data on mount
  useEffect(() => {
    fetch('/api/get-portfolio') // Or your respective data read path
      .then(res => res.json())
      .then(data => setPortfolioData(data))
      .catch(err => console.error("Error loading portfolio data:", err));

    // Check if an admin token session already exists locally
    const savedToken = localStorage.getItem('admin_secure_session');
    if (savedToken === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  }, []);

  // 2. Secret Key Combination Listener (Ctrl + Shift + A)
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
    // Matches the secret password token set up inside your local environment variable
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAuthModal(false);
      localStorage.setItem('admin_secure_session', passwordInput);
      alert("Terminal Verified: Admin options unlocked.");
    } else {
      alert("Access Denied: Invalid configuration token.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_secure_session');
  };

  return (
    <div className="bg-[#0B0F19] text-slate-200 min-h-screen">
      <Head>
        <title>JimmyOps | Quality Engineering Portfolio</title>
      </Head>

      {/* RECRUITER HEADER STATUS */}
      <nav class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <span class="font-bold text-white">🛡️ JimmyOps Portfolio</span>
        {isAdmin && (
          <button onClick={handleLogout} className="text-xs bg-red-950 text-red-400 px-3 py-1 rounded border border-red-900">
            Exit Admin Session
          </button>
        )}
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* PUBLIC VIEWPORT: This is what recruiters see cleanly */}
        <section className="text-center py-12 space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Senior QA & Automation Systems</h1>
          <p className="text-slate-400 text-sm">Hit "Ctrl + Shift + A" to open administrative tools terminal.</p>
        </section>

        {/* SECURED VIEWPORT CONTROL BLOCK */}
        {isAdmin ? (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-fade-in">
            <h2 className="text-amber-400 font-mono text-sm mb-4">⚙️ ADMIN ENGINE ACTIVE</h2>
            {/* Renders your original editing forms component */}
            <PortfolioCMS data={portfolioData} token={passwordInput || localStorage.getItem('admin_secure_session')} />
          </div>
        ) : (
          <div className="text-center py-6 text-slate-600 text-xs font-mono">
            [🔒 Secure Admin Pipeline Offline]
          </div>
        )}
      </main>

      {/* HIDDEN MODAL TERMINAL GATING PROMPT */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">🔑 Authorization Terminal</h3>
              <p className="text-slate-400 text-xxs">Input credentials token to modify database files.</p>
            </div>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter secure password..." 
              className="w-full bg-black border border-slate-800 rounded-lg p-2 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-600"
            />
            <div className="flex justify-end gap-2 text-xxs font-mono">
              <button onClick={() => setShowAuthModal(false)} className="text-slate-500 hover:text-slate-300 px-3 py-1.5">Close</button>
              <button onClick={handleAuthVerify} className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-1.5 rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}