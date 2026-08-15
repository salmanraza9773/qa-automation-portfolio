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
  const [analytics, setAnalytics] = useState({ pageViews: 0, projectClicks: 0 });

  // 1. Fetch data & register analytics
  useEffect(() => {
    // Local analytics counter tracking
    const currentViews = parseInt(localStorage.getItem('qa_portfolio_views') || '0', 10) + 1;
    const currentClicks = parseInt(localStorage.getItem('qa_portfolio_clicks') || '0', 10);
    localStorage.setItem('qa_portfolio_views', currentViews.toString());
    setAnalytics({ pageViews: currentViews, projectClicks: currentClicks });

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
        console.error("Using localized fallback data:", err);
        setPortfolioData({
          profile: { name: "Salman Raza", role: "Senior QA Automation Architect", bio: "Engineering scalable parallel end-to-end framework layers." },
          skills: [{ name: "Playwright", category: "UI Automation", description: "Parallel runner matrices." }],
          experience: [{ id: "1", role: "Lead Engineer", company: "QAOps Core Hub", duration: "2024 - Present", description: "Isolating runtime browser driver threads." }],
          projects: [],
          videos: [
            { id: "vid-1", category: "CI/CD EXECUTION", title: "Kubernetes Parallel Node Cluster Demo", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", desc: "Live thread pooling demo scaling headless browser runs dynamically." }
          ],
          blogs: [
            { id: "blog-1", category: "QA ARCHITECTURE LOG", date: "AUG 2026", title: "Overcoming Element Locator Fatigue via Proximity Trees", excerpt: "Why modern automation ditch brittle XPath locators in favor of relative DOM geometric proximity markers and self-healing AI nodes..." }
          ]
        });
        setIsLoading(false);
      });

    const savedToken = localStorage.getItem('admin_secure_session');
    if (savedToken && savedToken === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  }, []);

  // 2. Secret Terminal Shortcut (Ctrl + Shift + A)
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
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center text-cyan-400 font-mono text-xs">
        <span className="animate-pulse">// Initializing QA & AI Cyber Matrix streams...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#070A12] min-h-screen relative overflow-hidden font-sans text-gray-100">
      <Head>
        <title>{portfolioData?.profile?.name || "Salman Raza"} | QA & AI Automation Architect</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(1000%); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.05); }
          }
          .animate-scanline {
            animation: scanline 8s linear infinite;
          }
          .animate-pulseGlow {
            animation: pulseGlow 6s ease-in-out infinite;
          }
          .qa-grid-pattern {
            background-image: linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
          }
        `}</style>
      </Head>

      {/* ================= CREATIVE QA & AI TECH BACKGROUND MATRIX ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid Layer */}
        <div className="absolute inset-0 qa-grid-pattern"></div>
        
        {/* Radial Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulseGlow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] animate-pulseGlow"></div>
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>

        {/* Laser QA Scanline Pass */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scanline"></div>

        {/* Ambient Decorative Watermarks */}
        <div className="absolute top-24 right-10 font-mono text-[9px] text-cyan-500/20 select-none tracking-widest hidden md:block leading-relaxed">
          [AI_MODEL: ACTIVE]<br/>
          [QA_SUITE: PASSING 99.8%]<br/>
          [THREAD_POOL: RUNNING]<br/>
          [SELF_HEAL: ENABLED]
        </div>
        <div className="absolute bottom-10 left-8 font-mono text-[9px] text-emerald-500/20 select-none tracking-widest hidden md:block leading-relaxed">
          &lt;TestRunner status="HEALTHY" parallel="true" /&gt;<br/>
          &lt;LOCATOR_ENGINE type="AI_GEOMETRIC" /&gt;
        </div>
      </div>

      {/* FLOATING NAVBAR WITH RECRUITER ANALYTICS DISPLAY */}
      <nav className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-cyan-900/40 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-mono font-bold tracking-wider text-white flex items-center gap-2 text-sm">
            ⚡ {portfolioData?.profile?.name?.toUpperCase() || "SALMAN RAZA"} <span className="text-cyan-400 text-xs font-normal font-mono border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-950/40">QA & AI CORE</span>
          </span>
        </div>

        {/* Recruiter Visitor Analytics Widget */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-xl font-mono text-xs">
            <span className="flex items-center gap-1.5 text-gray-400">
              👁️ <span className="text-cyan-400 font-bold">{analytics.pageViews}</span> Views
            </span>
            <span className="w-px h-3 bg-gray-800"></span>
            <span className="flex items-center gap-1.5 text-gray-400">
              ⚡ <span className="text-emerald-400 font-bold">{analytics.projectClicks}</span> Inspection Clicks
            </span>
          </div>

          {isAdmin ? (
            <button onClick={handleLogout} className="text-xs font-mono bg-red-950/60 hover:bg-red-900/80 text-red-400 px-3.5 py-1.5 rounded-xl border border-red-900/50 transition-colors">
              Exit Session Gate
            </button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors">
              🔒 Admin Shell
            </button>
          )}
        </div>
      </nav>

      {/* RENDER PORTFOLIO CONTENT */}
      <div className="relative z-10">
        <PortfolioCMS 
          initialData={portfolioData} 
          token={passwordInput || localStorage.getItem('admin_secure_session')} 
          forceAdminView={isAdmin} 
        />
      </div>

      {/* AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D121F] border border-cyan-500/40 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl animate-fade-in relative">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">🔑 Admin CMS Authentication</h3>
              <p className="text-gray-400 text-xs mt-1">Enter your password token to unlock video & blog management tools.</p>
            </div>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter server payload key..." 
              className="w-full bg-[#070A12] border border-cyan-900/60 rounded-xl p-3 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
            <div className="flex justify-end gap-2 text-xs font-mono font-bold uppercase tracking-wider">
              <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-gray-300 px-4 py-2 rounded-lg transition-colors">Close</button>
              <button onClick={handleAuthVerify} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-lg transition-all font-bold shadow-lg shadow-cyan-500/20">Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}