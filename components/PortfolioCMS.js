// components/PortfolioCMS.js
import React, { useState, useEffect, useRef } from 'react';
import { Folder, FileCode, Terminal, Layers, User, Phone, Linkedin, Github, Edit, Eye, ChevronRight, ChevronDown, CheckCircle, RefreshCw, Trash2, X, Briefcase, Plus, Save, Video, BookOpen, BarChart3, Activity, MousePointer, Eye as EyeIcon, Share2 } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javaScript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';
import xml from 'react-syntax-highlighter/dist/cjs/languages/prism/xml-doc';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

SyntaxHighlighter.registerLanguage('javascript', javaScript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('pom', xml);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);

const detectLanguage = (fileName) => {
  if (!fileName) return 'text';
  const ext = fileName.split('.').pop().toLowerCase();
  const map = {
    'js': 'javascript', 'jsx': 'javascript', 'ts': 'javascript', 'tsx': 'javascript',
    'java': 'java', 'xml': 'xml', 'pom': 'xml', 'html': 'xml', 'py': 'python', 'sh': 'bash'
  };
  return map[ext] || 'text';
};

// 🎨 Bold & Vibrant 3D Floating QA Background Canvas Component
const Vibrant3DBackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const qaKeywords = [
      { text: 'PLAYWRIGHT', color: '#00F0FF', shadow: '#0088FF' },
      { text: 'SELENIUM', color: '#FF007F', shadow: '#99004C' },
      { text: 'AI IN TESTING', color: '#39FF14', shadow: '#009900' },
      { text: 'QA AUTOMATION', color: '#FFD700', shadow: '#CC9900' },
      { text: 'CUCUMBER BDD', color: '#00FFCC', shadow: '#009999' },
      { text: 'REST ASSURED', color: '#BF00FF', shadow: '#660099' },
      { text: 'CI/CD PIPELINE', color: '#FF5722', shadow: '#BF360C' },
      { text: 'SELF-HEALING', color: '#FF0055', shadow: '#88002D' }
    ];

    const particles = Array.from({ length: 18 }, () => {
      const kw = qaKeywords[Math.floor(Math.random() * qaKeywords.length)];
      return {
        text: kw.text,
        color: kw.color,
        shadow: kw.shadow,
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: 0.3 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        scale: 0.8 + Math.random() * 0.6,
        fontSize: Math.floor(22 + Math.random() * 16)
      };
    });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.save();
        ctx.font = `900 ${Math.floor(p.fontSize * p.scale)}px "Fira Code", "Courier New", monospace`;
        
        // 3D Extrusion Shadow Depth Layers
        const depth = 5;
        for (let i = depth; i > 0; i--) {
          ctx.fillStyle = p.shadow;
          ctx.fillText(p.text, p.x + i, p.y + i);
        }

        // Foreground Bright Face Text
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();

        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -50) {
          p.y = height + 50;
          p.x = Math.random() * width;
        }
        if (p.x < -100 || p.x > width + 100) {
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

export default function PortfolioCMS({ initialData, token, forceAdminView }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('projects');
  const [activeProject, setActiveProject] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedFileCode, setSelectedFileCode] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isSavingAll, setIsSavingAll] = useState(false);

  // Private Analytics Dashboard State
  const [analytics, setAnalytics] = useState({ pageViews: 0, projectClicks: 0, videoViews: 0, blogViews: 0, contactClicks: 0 });

  // Form States
  const [editName, setEditName] = useState(data?.profile?.name || "");
  const [editRole, setEditRole] = useState(data?.profile?.role || "");
  const [editBio, setEditBio] = useState(data?.profile?.bio || "");
  const [editPhone, setEditPhone] = useState(data?.profile?.phone || "");
  const [editLinkedin, setEditLinkedin] = useState(data?.profile?.linkedin || "");
  const [editGithub, setEditGithub] = useState(data?.profile?.github || "");

  const [gitUrl, setGitUrl] = useState("");
  const [gitTitle, setGitTitle] = useState("");
  const [gitDesc, setGitDesc] = useState("");
  const [gitTech, setGitTech] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("UI Automation");
  const [newSkillDesc, setNewSkillDesc] = useState("");

  const [newExpRole, setNewExpRole] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpDuration, setNewExpDuration] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");

  const [newVidTitle, setNewVidTitle] = useState("");
  const [newVidCategory, setNewVidCategory] = useState("CI/CD Executions");
  const [newVidUrl, setNewVidUrl] = useState("");
  const [newVidDesc, setNewVidDesc] = useState("");

  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("QA ARCHITECTURE LOG");
  const [newBlogDate, setNewBlogDate] = useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");

  const [editingProject, setEditingProject] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalTech, setModalTech] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Fetch Analytics & Register Visitor Page View
  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((resData) => setAnalytics(resData))
      .catch(() => {});

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'pageView' })
    }).catch(() => {});
  }, []);

  const trackEvent = (eventType) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType })
    })
      .then((res) => res.json())
      .then((updated) => setAnalytics(updated))
      .catch(() => {});
  };

  const persistToDatabase = async (updatedData) => {
    setIsSavingAll(true);
    try {
      const response = await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error("Failed to overwrite data engine file structures.");
    } catch (err) {
      console.error("AutoSave failure: ", err.message);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const updated = {
      ...data,
      profile: { name: editName, role: editRole, bio: editBio, phone: editPhone, linkedin: editLinkedin, github: editGithub }
    };
    setData(updated);
    await persistToDatabase(updated);
    alert("Profile configurations saved live!");
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName) return;
    const updatedSkills = [...(data?.skills || []), { name: newSkillName, category: newSkillCategory, description: newSkillDesc }];
    const updated = { ...data, skills: updatedSkills };
    setData(updated);
    setNewSkillName(""); setNewSkillDesc("");
    await persistToDatabase(updated);
  };

  const handleDeleteSkill = async (indexToDelete) => {
    const updatedSkills = data.skills.filter((_, idx) => idx !== indexToDelete);
    const updated = { ...data, skills: updatedSkills };
    setData(updated);
    await persistToDatabase(updated);
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!newExpRole || !newExpCompany) return;
    const newEntry = { id: `exp-${Date.now()}`, role: newExpRole, company: newExpCompany, duration: newExpDuration, description: newExpDesc };
    const updatedExp = [...(data?.experience || []), newEntry];
    const updated = { ...data, experience: updatedExp };
    setData(updated);
    setNewExpRole(""); setNewExpCompany(""); setNewExpDuration(""); setNewExpDesc("");
    await persistToDatabase(updated);
  };

  const handleDeleteExperience = async (id) => {
    const updatedExp = data.experience.filter(exp => exp.id !== id);
    const updated = { ...data, experience: updatedExp };
    setData(updated);
    await persistToDatabase(updated);
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVidTitle || !newVidUrl) return;
    let formattedUrl = newVidUrl;
    if (formattedUrl.includes('watch?v=')) {
      formattedUrl = formattedUrl.replace('watch?v=', 'embed/');
    }
    const newVid = { id: `vid-${Date.now()}`, title: newVidTitle, category: newVidCategory, url: formattedUrl, desc: newVidDesc };
    const updatedVids = [...(data?.videos || []), newVid];
    const updated = { ...data, videos: updatedVids };
    setData(updated);
    setNewVidTitle(""); setNewVidUrl(""); setNewVidDesc("");
    await persistToDatabase(updated);
  };

  const handleDeleteVideo = async (id) => {
    const updatedVids = (data?.videos || []).filter(v => v.id !== id);
    const updated = { ...data, videos: updatedVids };
    setData(updated);
    await persistToDatabase(updated);
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogExcerpt) return;
    const newEntry = { id: `blog-${Date.now()}`, title: newBlogTitle, category: newBlogCategory, date: newBlogDate || "AUGUST 2026", excerpt: newBlogExcerpt };
    const updatedBlogs = [...(data?.blogs || []), newEntry];
    const updated = { ...data, blogs: updatedBlogs };
    setData(updated);
    setNewBlogTitle(""); setNewBlogDate(""); setNewBlogExcerpt("");
    await persistToDatabase(updated);
  };

  const handleDeleteBlog = async (id) => {
    const updatedBlogs = (data?.blogs || []).filter(b => b.id !== id);
    const updated = { ...data, blogs: updatedBlogs };
    setData(updated);
    await persistToDatabase(updated);
  };

  const handleGitHubSync = async (e) => {
    e.preventDefault();
    if (!gitUrl) return alert("Please enter a URL.");
    setIsSyncing(true);
    try {
      const response = await fetch('/api/github-sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          repoUrl: gitUrl, projectTitle: gitTitle, projectDescription: gitDesc,
          projectTech: gitTech.split(',').map(t => t.trim()).filter(t => t.length > 0)
        })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      setData(prevData => ({ ...prevData, projects: [...(prevData?.projects || []), resData.project] }));
      setGitUrl(""); setGitTitle(""); setGitDesc(""); setGitTech("");
      alert("Framework Ingested Successfully!");
    } catch (err) { alert(`Sync Error: ${err.message}`); } finally { setIsSyncing(false); }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Delete this framework project permanently?")) return;
    try {
      const response = await fetch('/api/delete-project', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ id: projectId })
      });
      if (!response.ok) throw new Error("Deletion failed.");
      setData(prevData => ({ ...prevData, projects: prevData.projects.filter(p => p.id !== projectId) }));
      if (activeProject === projectId) { setActiveProject(null); setSelectedFileCode(null); setSelectedFileName(""); }
    } catch (err) { alert(err.message); }
  };

  const toggleNode = (path) => { setExpandedNodes(prev => ({ ...prev, [path]: !prev[path] })); };

  const renderTree = (node, currentPath = "") => {
    if (!node) return null;
    return Object.entries(node).map(([key, value]) => {
      const nodePath = `${currentPath}/${key}`;
      const isDirectory = typeof value === 'object' && !value.isCloudFile;
      if (isDirectory) {
        return (
          <div key={nodePath} className="pl-4">
            <button type="button" onClick={() => toggleNode(nodePath)} className="flex items-center gap-2 py-1 text-gray-300 hover:text-accentNeon transition-colors">
              {expandedNodes[nodePath] ? <ChevronDown size={16} /> : <ChevronRight size={16} /> }
              <Folder size={18} className="text-yellow-500 fill-yellow-500" />
              <span className="font-mono text-sm">{key}</span>
            </button>
            {expandedNodes[nodePath] && <div>{renderTree(value, nodePath)}</div>}
          </div>
        );
      } else {
        return (
          <div key={nodePath} className="pl-8 py-1">
            <button type="button" 
              onClick={async () => { 
                setSelectedFileName(key); 
                if (value && value.isCloudFile) {
                  setSelectedFileCode("// Fetching real code contents live from GitHub stream...");
                  try {
                    const res = await fetch(value.rawUrl);
                    setSelectedFileCode(await res.text());
                  } catch (err) { setSelectedFileCode(`// Error: ${err.message}`); }
                } else { setSelectedFileCode(value); } 
              }}
              className={`flex items-center gap-2 font-mono text-sm ${selectedFileName === key ? 'text-accentNeon font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              <FileCode size={16} className="text-blue-400" /> {key}
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="bg-[#0B0F19] text-gray-100 font-sans selection:bg-accentNeon selection:text-darkBg relative overflow-hidden min-h-screen">
      
      {/* 3D Bold & Vivid Animated QA Background Canvas */}
      <Vibrant3DBackgroundCanvas />

      {/* ================= ADMIN CMS CONTROL FACE ================= */}
      {forceAdminView && (
        <section className="max-w-4xl mx-auto my-8 p-6 bg-slate-900/95 backdrop-blur-md rounded-xl border border-cyan-500/50 shadow-2xl space-y-12 animate-fade-in relative z-20">
          
          {/* PRIVATE ADMIN ANALYTICS TELEMETRY PANEL */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 shadow-inner">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <BarChart3 size={20} />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Private Recruiter & Interaction Analytics</h2>
              </div>
              <span className="text-xxs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Sync Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
              <div className="bg-slate-900 border border-gray-800 p-3 rounded-xl text-center">
                <span className="text-xxs text-gray-500 block mb-1">PAGE VIEWS</span>
                <span className="text-xl font-bold text-cyan-400">{analytics.pageViews}</span>
              </div>
              <div className="bg-slate-900 border border-gray-800 p-3 rounded-xl text-center">
                <span className="text-xxs text-gray-500 block mb-1">CODE TREES</span>
                <span className="text-xl font-bold text-cyan-400">{analytics.projectClicks}</span>
              </div>
              <div className="bg-slate-900 border border-gray-800 p-3 rounded-xl text-center">
                <span className="text-xxs text-gray-500 block mb-1">VIDEO VIEWS</span>
                <span className="text-xl font-bold text-cyan-400">{analytics.videoViews}</span>
              </div>
              <div className="bg-slate-900 border border-gray-800 p-3 rounded-xl text-center">
                <span className="text-xxs text-gray-500 block mb-1">BLOG READS</span>
                <span className="text-xl font-bold text-cyan-400">{analytics.blogViews}</span>
              </div>
              <div className="bg-slate-900 border border-gray-800 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
                <span className="text-xxs text-gray-500 block mb-1">CONTACT CLICKS</span>
                <span className="text-xl font-bold text-cyan-400">{analytics.contactClicks}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Profile Modifications */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <User size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Modify Profile Identity & Contact Links</h2> </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Full Name</label> <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Role Title</label> <input type="text" value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Contact Phone</label> <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">LinkedIn Profile Link</label> <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">GitHub Account Link</label> <input type="url" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
              </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Profile Bio Description Summary</label> <textarea rows="2" value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"> <Save size={16} /> Save Changes Live </button>
            </form>
          </div>

          {/* Section 2: Technical Skills Matrix */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Layers size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Manage Technical Skills Matrix</h2> </div>
            <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-950/40 p-4 rounded-xl border border-gray-800 mb-4">
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Skill / Tool Name</label> <input type="text" required placeholder="e.g., Playwright" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Category Grouping</label> <select value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon">
                <option value="UI Automation">UI Automation</option> <option value="API Testing">API Testing</option> <option value="Test Runner">Test Runner</option> <option value="Build Tools">Build Tools</option> <option value="DevOps">DevOps</option> </select> </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Short Application Summary</label> <input type="text" placeholder="e.g., Built cross-browser parallel matrix layers." value={newSkillDesc} onChange={(e) => setNewSkillDesc(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="md:col-span-3 bg-gray-800 border border-gray-700 hover:border-accentNeon text-white py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"> <Plus size={14}/> Inject Tool Node </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {(data?.skills || []).map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 text-xs bg-slate-950 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-md">
                  <strong>{skill.name}</strong> <span className="text-gray-600">({skill.category})</span>
                  <button type="button" onClick={() => handleDeleteSkill(index)} className="text-red-500 hover:text-red-400 cursor-pointer"> <X size={12} /> </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Professional Experience */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Briefcase size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Manage Professional Experience Trackers</h2> </div>
            <form onSubmit={handleAddExperience} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-gray-800 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Designation Role Title</label> <input type="text" required placeholder="e.g., Lead QA Architect" value={newExpRole} onChange={(e) => setNewExpRole(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Company Entity Name</label> <input type="text" required placeholder="e.g., Google Operations" value={newExpCompany} onChange={(e) => setNewExpCompany(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Tenure Duration</label> <input type="text" placeholder="e.g., 2024 - Present" value={newExpDuration} onChange={(e) => setNewExpDuration(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Core Responsibilities & Milestones</label> <textarea rows="3" placeholder="e.g., Authored thread-safe frameworks..." value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="w-full bg-gray-800 border border-gray-700 text-white py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"> <Plus size={14}/> Inject Experience Node </button>
            </form>
            <div className="space-y-2">
              {(data?.experience || []).map((exp) => (
                <div key={exp.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-gray-800 text-xs">
                  <div><strong>{exp.role}</strong> at <span className="text-accentNeon">{exp.company}</span> <span className="text-gray-500 font-mono">({exp.duration})</span></div>
                  <button type="button" onClick={() => handleDeleteExperience(exp.id)} className="text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"> <Trash2 size={12}/> Remove </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Video Walkthroughs */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Video size={18} className="text-cyan-400" /> <h2 className="text-lg font-bold text-white">Manage Infrastructure Video Walkthroughs</h2> </div>
            <form onSubmit={handleAddVideo} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-gray-800 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Video Title</label> <input type="text" required placeholder="e.g., Playwright Parallel Runner Demo" value={newVidTitle} onChange={(e) => setNewVidTitle(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">YouTube Embed / Watch URL</label> <input type="text" required placeholder="https://www.youtube.com/watch?v=..." value={newVidUrl} onChange={(e) => setNewVidUrl(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
              </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Video Description</label> <input type="text" placeholder="e.g., Demonstrates Playwright runner grid scaling..." value={newVidDesc} onChange={(e) => setNewVidDesc(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="w-full bg-gray-800 border border-gray-700 text-white py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"> <Plus size={14}/> Inject Video Walkthrough </button>
            </form>
            <div className="space-y-2">
              {(data?.videos || []).map((vid) => (
                <div key={vid.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-gray-800 text-xs">
                  <div><strong>{vid.title}</strong> <span className="text-gray-500 font-mono">({vid.category})</span></div>
                  <button type="button" onClick={() => handleDeleteVideo(vid.id)} className="text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"> <Trash2 size={12}/> Remove </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Engineering Blogs */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <BookOpen size={18} className="text-cyan-400" /> <h2 className="text-lg font-bold text-white">Manage Engineering Blog Archives</h2> </div>
            <form onSubmit={handleAddBlog} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-gray-800 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Article Title</label> <input type="text" required placeholder="e.g., AI in Test Automation: Self-Healing Locators" value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Publication Date Stamp</label> <input type="text" placeholder="e.g., AUGUST 2026" value={newBlogDate} onChange={(e) => setNewBlogDate(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
              </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Summary Excerpt</label> <textarea rows="2" placeholder="e.g., An in-depth breakdown of self-healing locator engines..." value={newBlogExcerpt} onChange={(e) => setNewBlogExcerpt(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="w-full bg-gray-800 border border-gray-700 text-white py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"> <Plus size={14}/> Inject Blog Article </button>
            </form>
            <div className="space-y-2">
              {(data?.blogs || []).map((blog) => (
                <div key={blog.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-gray-800 text-xs">
                  <div><strong>{blog.title}</strong> <span className="text-gray-500 font-mono">({blog.date})</span></div>
                  <button type="button" onClick={() => handleDeleteBlog(blog.id)} className="text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"> <Trash2 size={12}/> Remove </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: GitHub Ingestor */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Github size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Ingest External Automation Framework Repositories</h2> </div>
            <form onSubmit={handleGitHubSync} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">GitHub Repo URL</label> <input type="url" required placeholder="https://github.com/username/repo" value={gitUrl} onChange={(e) => setGitUrl(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Custom Title Override</label> <input type="text" placeholder="e.g., Cucumber BDD Framework Engine" value={gitTitle} onChange={(e) => setGitTitle(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Short Description Matrix Context</label> <input type="text" placeholder="Description details..." value={gitDesc} onChange={(e) => setGitDesc(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Technology Keywords (Comma Separated)</label> <input type="text" placeholder="Java, Selenium, Maven" value={gitTech} onChange={(e) => setGitTech(e.target.value)} className="w-full bg-slate-950 border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <button type="submit" disabled={isSyncing} className="w-full bg-cyan-500 text-slate-950 font-extrabold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"> <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Connecting and building structural nodes..." : "Trigger Live Repository Sync Ingestion Pipeline"} </button>
            </form>
          </div>
        </section>
      )}

      {/* ================= PUBLIC PORTFOLIO FACE ================= */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 relative z-10 animate-fade-in">
        
        {/* Profile Identity Block */}
        <section className="flex flex-col items-start gap-4 py-12 max-w-4xl bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-transparent p-8 rounded-3xl border border-gray-800/80 backdrop-blur-md relative overflow-hidden group hover:border-gray-700/60 transition-all">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-500/20 transition-colors"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-full border border-gray-800 text-xs text-cyan-400 font-mono tracking-wide"> 
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Status: Open for Technical Opportunities 
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">{data?.profile?.name}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-400 font-mono text-cyan-400/90">{data?.profile?.role}</h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">{data?.profile?.bio}</p>
          
          <div className="flex flex-wrap gap-4 pt-4 w-full border-t border-gray-800/60 mt-4"> 
            {data?.profile?.phone && <a href={`tel:${data.profile.phone}`} onClick={() => trackEvent('contactClick')} className="flex items-center gap-2 bg-slate-950 hover:bg-gray-800/80 border border-gray-800 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider text-gray-300 hover:text-white transition-all group"><Phone size={14} className="text-cyan-400 group-hover:scale-110 transition-transform"/> Contact Me</a>} 
            {data?.profile?.linkedin && <a href={data.profile.linkedin} target="_blank" rel="noreferrer" onClick={() => trackEvent('contactClick')} className="flex items-center gap-2 bg-slate-950 hover:bg-gray-800/80 border border-gray-800 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider text-gray-300 hover:text-white transition-all group"><Linkedin size={14} className="text-cyan-400 group-hover:scale-110 transition-transform"/> LinkedIn</a>} 
            {data?.profile?.github && <a href={data.profile.github} target="_blank" rel="noreferrer" onClick={() => trackEvent('contactClick')} className="flex items-center gap-2 bg-slate-950 hover:bg-gray-800/80 border border-gray-800 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider text-gray-300 hover:text-white transition-all group"><Github size={14} className="text-cyan-400 group-hover:scale-110 transition-transform"/> GitHub</a>} 
          </div>
        </section>

        {/* Dynamic Telemetry Performance Strips */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-gray-800 p-6 rounded-2xl text-center backdrop-blur-sm relative group hover:border-gray-700/60 transition-all">
            <span className="text-xxs font-mono text-cyan-400 tracking-widest block mb-1">PARALLEL ACCELERATION</span>
            <span className="text-2xl font-bold text-white font-mono tracking-tight">4.5x Execution Speedup</span>
          </div>
          <div className="bg-slate-900/50 border border-gray-800 p-6 rounded-2xl text-center backdrop-blur-sm relative group hover:border-gray-700/60 transition-all">
            <span className="text-xxs font-mono text-cyan-400 tracking-widest block mb-1">REGRESSION STAGE RELIABILITY</span>
            <span className="text-2xl font-bold text-white font-mono tracking-tight">99.4% Stability Gate</span>
          </div>
          <div className="bg-slate-900/50 border border-gray-800 p-6 rounded-2xl text-center backdrop-blur-sm relative group hover:border-gray-700/60 transition-all">
            <span className="text-xxs font-mono text-cyan-400 tracking-widest block mb-1">E2E TEST CYCLE OPTIMIZATION</span>
            <span className="text-2xl font-bold text-white font-mono tracking-tight">Zero-Flakiness Layer</span>
          </div>
        </section>

        {/* Skill Matrix Framework Display */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2"> <Layers className="text-cyan-400" size={20} /> <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">Technical Skills Matrix & Toolkit</h3> </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(data?.skills || []).map((skill, index) => (
              <div key={index} className="bg-slate-900/40 p-5 rounded-xl border border-gray-800/80 hover:border-cyan-400/40 transition-all group relative">
                <span className="text-xxs font-mono px-2 py-0.5 bg-slate-950 rounded border border-gray-800 text-cyan-400/90">{skill.category}</span>
                <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-400 transition-colors">{skill.name}</h4>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{skill.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MASTER MEDIA TABS */}
        <section className="space-y-6">
          <div className="flex justify-start border-b border-gray-800 font-mono text-xs tracking-wider">
            <div className="flex space-x-6">
              <button onClick={() => setActiveTab('projects')} className={`pb-4 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'projects' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                📁 AUTOMATION RUNNERS ({(data?.projects || []).length})
              </button>
              <button onClick={() => setActiveTab('videos')} className={`pb-4 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'videos' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                🎥 INFRASTRUCTURE WALKTHROUGHS ({(data?.videos || []).length})
              </button>
              <button onClick={() => setActiveTab('blogs')} className={`pb-4 font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'blogs' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                ✍️ ENGINEERING ARCHIVES ({(data?.blogs || []).length})
              </button>
            </div>
          </div>

          <div className="pt-2 animate-fade-in">
            {/* TAB 1: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                {(data?.projects || []).map((project) => (
                  <div key={project.id} className="bg-slate-900/40 rounded-xl border border-gray-800 overflow-hidden group hover:border-gray-700/60 transition-colors">
                    <div onClick={() => { 
                      setActiveProject(activeProject === project.id ? null : project.id); 
                      setSelectedFileCode(null); 
                      setSelectedFileName(""); 
                      trackEvent('projectClick');
                    }} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-800/20 transition-all" >
                      <div className="space-y-2 max-w-4xl"> 
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{project.title}</h4> 
                        <p className="text-gray-400 text-xs whitespace-pre-line leading-relaxed">{project.shortDescription}</p>
                        <div className="flex gap-2 flex-wrap pt-2">
                          {(project.tech || []).map((t, idx) => ( <span key={idx} className="text-xxs bg-slate-950 text-gray-400 font-mono px-2.5 py-0.5 rounded border border-gray-800">{t}</span> ))}
                        </div>
                      </div>
                      <button type="button" className="bg-slate-950 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 px-4 py-2 rounded-lg border border-gray-800 text-xs font-mono font-bold transition-all shadow shrink-0 self-start md:self-center cursor-pointer"> {activeProject === project.id ? "Collapse Code Engine" : "Inspect Code Tree"} </button>
                    </div>
                    {activeProject === project.id && (
                      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-800 bg-slate-950/50 min-h-[350px]">
                        <div className="p-4 border-r border-gray-800 overflow-y-auto max-h-[500px]">
                          <div className="text-xxs font-mono text-gray-500 uppercase tracking-widest mb-3 font-bold">Package Structure Hierarchy</div>
                          {renderTree(project.files)}
                        </div>
                        <div className="col-span-2 flex flex-col h-full bg-[#0d111c] min-h-[400px]">
                          <div className="text-xxs font-mono text-gray-500 uppercase tracking-widest p-4 pb-2 border-b border-gray-900 flex justify-between items-center bg-[#0d111c] sticky top-0">
                            <span>Active File Source View</span> {selectedFileName && <span className="text-cyan-400 lowercase font-semibold font-mono">{selectedFileName}</span>}
                          </div>
                          <div className="flex-grow font-mono text-xs overflow-auto bg-[#0d111c] shadow-inner">
                            {selectedFileCode ? (
                              <SyntaxHighlighter language={detectLanguage(selectedFileName)} style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '1rem', fontSize: '13px', lineHeight: '1.6' }} lineNumberStyle={{color: '#4a5568', paddingRight: '1rem'}} showLineNumbers={true} wrapLongLines={true}>
                                {selectedFileCode}
                              </SyntaxHighlighter>
                            ) : ( <div className="p-6 text-gray-600 italic font-mono text-xs"> // Select any source file class from the project hierarchy tree structure to mount text. </div> )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: VIDEOS */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data?.videos || []).map((video, idx) => (
                  <div key={video.id || idx} onClick={() => trackEvent('videoView')} className="bg-slate-900/40 border border-gray-800 p-5 rounded-2xl space-y-4 hover:border-gray-700 transition-all group">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-gray-800/80 shadow-2xl relative">
                      <iframe className="w-full h-full" src={video.url} title={video.title} frameBorder="0" allowFullScreen></iframe>
                    </div>
                    <div>
                      <span className="text-xxs font-mono font-bold text-cyan-400 tracking-wider uppercase">[{video.category}]</span>
                      <h4 className="font-bold text-white text-base mt-1 group-hover:text-cyan-400 transition-colors">{video.title}</h4>
                      <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{video.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: BLOGS */}
            {activeTab === 'blogs' && (
              <div className="space-y-4 max-w-4xl mx-auto">
                {(data?.blogs || []).map((blog, idx) => (
                  <article key={blog.id || idx} onClick={() => trackEvent('blogView')} className="bg-slate-900/20 border border-gray-800/60 p-6 rounded-2xl hover:border-gray-700/80 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between text-xxs font-mono text-gray-500 mb-2">
                      <span className="text-cyan-400 font-bold tracking-widest">[{blog.category}]</span>
                      <span>{blog.date}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{blog.title}</h4>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">{blog.excerpt}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2"> <Briefcase className="text-cyan-400" size={20} /> <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">Professional Experience History</h3> </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:right-auto before:left-3.5 before:w-px before:bg-gray-800/80">
            {(data?.experience || []).map((exp) => (
              <div key={exp.id} className="relative pl-8 group animate-fade-in">
                <div className="absolute left-2.5 top-2 w-2 h-2 rounded-full bg-cyan-400 border border-slate-950 ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />
                <div className="bg-slate-900/30 border border-gray-800 rounded-xl p-5 hover:border-gray-700/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 mb-2">
                    <h4 className="text-base font-bold text-white">{exp.role} <span className="text-cyan-400 font-normal font-mono text-sm">@ {exp.company}</span></h4>
                    <span className="text-xxs font-mono bg-slate-950 text-gray-400 px-2 py-0.5 rounded border border-gray-800">{exp.duration}</span>
                  </div>
                  <p className="text-gray-400 text-xs whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}