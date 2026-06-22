import React, { useState } from 'react';
import { Folder, FileCode, Terminal, Layers, User, Phone, Linkedin, Github, Edit, Eye, ChevronRight, ChevronDown, CheckCircle, RefreshCw, Trash2, X, Briefcase, Plus, Save } from 'lucide-react';
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

export default function PortfolioCMS({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedFileCode, setSelectedFileCode] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isSavingAll, setIsSavingAll] = useState(false);

  // Profile Link State Extensions
  const [editName, setEditName] = useState(data.profile.name);
  const [editRole, setEditRole] = useState(data.profile.role);
  const [editBio, setEditBio] = useState(data.profile.bio);
  const [editPhone, setEditPhone] = useState(data.profile.phone || "");
  const [editLinkedin, setEditLinkedin] = useState(data.profile.linkedin || "");
  const [editGithub, setEditGithub] = useState(data.profile.github || "");

  // Ingestion States
  const [gitUrl, setGitUrl] = useState("");
  const [gitTitle, setGitTitle] = useState("");
  const [gitDesc, setGitDesc] = useState("");
  const [gitTech, setGitTech] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Skill Creation States
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("UI Automation");
  const [newSkillDesc, setNewSkillDesc] = useState("");

  // Experience Creation States
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpDuration, setNewExpDuration] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");

  // Edit Modal States
  const [editingProject, setEditingProject] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalTech, setModalTech] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Global Sync logic pushing memory straight to our backend save handler
  const persistToDatabase = async (updatedData) => {
    setIsSavingAll(true);
    try {
      const response = await fetch('/pages/api/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const updatedSkills = [...data.skills, { name: newSkillName, category: newSkillCategory, description: newSkillDesc }];
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
    const updatedExp = [...(data.experience || []), newEntry];
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

  const handleGitHubSync = async (e) => {
    e.preventDefault();
    if (!gitUrl) return alert("Please enter a URL.");
    setIsSyncing(true);
    try {
      const response = await fetch('/api/github-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: gitUrl, projectTitle: gitTitle, projectDescription: gitDesc,
          projectTech: gitTech.split(',').map(t => t.trim()).filter(t => t.length > 0)
        })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message);
      setData(prevData => ({ ...prevData, projects: [...prevData.projects, resData.project] }));
      setGitUrl(""); setGitTitle(""); setGitDesc(""); setGitTech("");
      alert("Framework Ingested Successfully!");
    } catch (err) { alert(`Sync Error: ${err.message}`); } finally { setIsSyncing(false); }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Delete this framework project permanently?")) return;
    try {
      const response = await fetch(`/api/delete-project?id=${projectId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Deletion failed.");
      setData(prevData => ({ ...prevData, projects: prevData.projects.filter(p => p.id !== projectId) }));
      if (activeProject === projectId) { setActiveProject(null); setSelectedFileCode(null); setSelectedFileName(""); }
    } catch (err) { alert(err.message); }
  };

  const openEditModal = (project) => {
    setEditingProject(project); setModalTitle(project.title); setModalDesc(project.shortDescription); setModalTech(project.tech.join(', '));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const response = await fetch('/api/edit-project', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProject.id, title: modalTitle, shortDescription: modalDesc, tech: modalTech })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error("Update failed.");
      setData(prevData => ({ ...prevData, projects: prevData.projects.map(p => p.id === editingProject.id ? resData.project : p) }));
      setEditingProject(null);
    } catch (err) { alert(err.message); } finally { setIsSavingEdit(false); }
  };

  const toggleNode = (path) => { setExpandedNodes(prev => ({ ...prev, [path]: !prev[path] })); };

  const renderTree = (node, currentPath = "") => {
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
    <div className="min-h-screen bg-darkBg text-gray-100 font-sans selection:bg-accentNeon selection:text-darkBg">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 bg-cardBg/80 backdrop-blur-md border-b border-gray-800 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2"> <Terminal className="text-accentNeon" /> <span className="font-mono font-bold tracking-wider text-white">QA.AUTOMATION</span> </div>
        <div className="flex items-center gap-4">
          {isSavingAll && <span className="text-xs font-mono text-gray-500 animate-pulse">Autosaving to laptop...</span>}
          <button onClick={() => setIsAdmin(!isAdmin)} className="flex items-center gap-2 border border-gray-700 bg-darkBg hover:border-accentNeon text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all cursor-pointer">
            {isAdmin ? <Eye size={16} /> : <Edit size={16} />} {isAdmin ? "View Live Portfolio" : "Access Admin CMS Control Face"}
          </button>
        </div>
      </nav>

      {/* ================= ADMIN CMS CONTROL FACE ================= */}
      {isAdmin && (
        <section className="max-w-4xl mx-auto my-8 p-6 bg-cardBg rounded-xl border border-accentNeon/50 shadow-xl space-y-12 animate-fade-in">
          
          {/* Section 1: Profile Modifications & Social Core Links */}
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <User size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Modify Profile Identity & Contact Connect Links</h2> </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Full Name</label> <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Role Title</label> <input type="text" value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Contact Phone</label> <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">LinkedIn Profile Link</label> <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">GitHub Account Link</label> <input type="url" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
              </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Profile Bio Description Summary</label> <textarea rows="2" value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"> <Save size={16} /> Save Changes Live </button>
            </form>
          </div>

          {/* Section 2: Manage Toolkit Matrix Array */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Layers size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Manage Technical Skills Matrix</h2> </div>
            <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-darkBg/40 p-4 rounded-xl border border-gray-800 mb-4">
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Skill / Tool Name</label> <input type="text" required placeholder="e.g., Playwright" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Category Grouping</label> <select value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon">
                <option value="UI Automation">UI Automation</option> <option value="API Testing">API Testing</option> <option value="Test Runner">Test Runner</option> <option value="Build Tools">Build Tools</option> <option value="DevOps">DevOps</option> </select> </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Short Application Summary</label> <input type="text" placeholder="e.g., Built cross-browser parallel matrix layers." value={newSkillDesc} onChange={(e) => setNewSkillDesc(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="md:col-span-3 bg-gray-800 border border-gray-700 hover:border-accentNeon text-white py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"> <Plus size={14}/> Inject Tool Node </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 text-xs bg-darkBg border border-gray-800 text-gray-300 px-2.5 py-1 rounded-md">
                  <strong>{skill.name}</strong> <span className="text-gray-600">({skill.category})</span>
                  <button type="button" onClick={() => handleDeleteSkill(index)} className="text-red-500 hover:text-red-400 cursor-pointer"> <X size={12} /> </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Manage Professional Experience Timeline */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Briefcase size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Manage Professional Experience Trackers</h2> </div>
            <form onSubmit={handleAddExperience} className="space-y-3 bg-darkBg/40 p-4 rounded-xl border border-gray-800 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Designation Role Title</label> <input type="text" required placeholder="e.g., Lead QA Architect" value={newExpRole} onChange={(e) => setNewExpRole(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Company Entity Name</label> <input type="text" required placeholder="e.g., Google Operations" value={newExpCompany} onChange={(e) => setNewExpCompany(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Tenure Duration</label> <input type="text" placeholder="e.g., 2024 - Present" value={newExpDuration} onChange={(e) => setNewExpDuration(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1">Core Responsibilities & Milestones Achieved (Supports Newlines)</label> <textarea rows="3" placeholder="e.g., Authored thread-safe frameworks.\nReduced regression testing timeline bounds." value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              <button type="submit" className="w-full bg-gray-800 border border-gray-700 text-white py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1 cursor-pointer"> <Plus size={14}/> Inject Experience Node </button>
            </form>
            <div className="space-y-2">
              {(data.experience || []).map((exp) => (
                <div key={exp.id} className="flex justify-between items-center bg-darkBg p-3 rounded-lg border border-gray-800 text-xs">
                  <div><strong>{exp.role}</strong> at <span className="text-accentNeon">{exp.company}</span> <span className="text-gray-500 font-mono">({exp.duration})</span></div>
                  <button type="button" onClick={() => handleDeleteExperience(exp.id)} className="text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"> <Trash2 size={12}/> Remove </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Direct GitHub Sync Engine Ingestor */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Github size={18} className="text-accentNeon" /> <h2 className="text-lg font-bold text-white">Ingest External Automation Framework Repositories</h2> </div>
            <form onSubmit={handleGitHubSync} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">GitHub Repo URL</label> <input type="url" required placeholder="https://github.com/username/repo" value={gitUrl} onChange={(e) => setGitUrl(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon font-mono" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Custom Title Override</label> <input type="text" placeholder="e.g., Cucumber BDD Framework Engine" value={gitTitle} onChange={(e) => setGitTitle(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Short Description Matrix Context</label> <input type="text" placeholder="Description details..." value={gitDesc} onChange={(e) => setGitDesc(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
                <div> <label className="block text-xs font-mono text-gray-400 mb-1">Technology Keywords (Comma Separated)</label> <input type="text" placeholder="Java, Selenium, Maven" value={gitTech} onChange={(e) => setGitTech(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-accentNeon" /> </div>
              </div>
              <button type="submit" disabled={isSyncing} className="w-full bg-accentNeon text-darkBg font-extrabold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-neon"> <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Connecting and building structural nodes..." : "Trigger Live Repository Sync Ingestion Pipeline"} </button>
            </form>
          </div>

          {/* Section 5: Repositories Modifiers and Housekeeping */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2"> <Terminal size={18} className="text-white" /> <h2 className="text-lg font-bold text-white">Modify & Housekeep Active Framework Repositories</h2> </div>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id} className="flex justify-between items-center bg-darkBg p-3 rounded-lg border border-gray-800">
                  <div> <p className="text-sm font-semibold text-white">{project.title}</p> <p className="text-xs text-gray-500 font-mono">ID: {project.id}</p> </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEditModal(project)} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer"> <Edit size={14} /> Edit Metadata </button>
                    <button type="button" onClick={() => handleDelete(project.id)} className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer"> <Trash2 size={14} /> Delete </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= EDIT PROJECT MODAL ================= */}
      {editingProject && (
        <div className="fixed inset-0 bg-darkBg/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-cardBg w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <div className="flex items-center gap-2 text-white"> <Edit className="text-accentNeon" size={18}/> <h3 className="text-lg font-bold">Edit Repository Metadata</h3> </div>
              <button onClick={() => setEditingProject(null)} className="text-gray-500 hover:text-white cursor-pointer"> <X size={20} /> </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div> <label className="block text-xs font-mono text-gray-400 mb-1.5">Display Title</label> <input type="text" required value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-accentNeon"/> </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1.5">Description (Supports pre-line line breaks)</label> <textarea rows="6" value={modalDesc} onChange={(e) => setModalDesc(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-xl p-3 text-white text-sm whitespace-pre-line focus:outline-none focus:border-accentNeon leading-relaxed"/> </div>
              <div> <label className="block text-xs font-mono text-gray-400 mb-1.5">Technologies (Comma Separated)</label> <input type="text" value={modalTech} onChange={(e) => setModalTech(e.target.value)} className="w-full bg-darkBg border border-gray-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-accentNeon font-mono"/> </div>
              <div className="flex gap-3 mt-6 pt-5 justify-end border-t border-gray-800">
                <button type="button" onClick={() => setEditingProject(null)} className="px-5 py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white text-sm cursor-pointer"> Cancel </button>
                <button type="submit" disabled={isSavingEdit} className="px-5 py-2.5 rounded-xl bg-accentNeon text-darkBg font-bold text-sm flex items-center gap-2 hover:bg-sky-400 disabled:bg-gray-700 cursor-pointer"> <CheckCircle size={16} /> Save </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PUBLIC PORTFOLIO FACE ================= */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        
        {/* Profile Identity Block */}
        <section className="flex flex-col items-start gap-4 py-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cardBg rounded-full border border-gray-800 text-xs text-accentNeon font-mono"> <User size={12} /> Status: Open for Technical Opportunities </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">{data.profile.name}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-400">{data.profile.role}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{data.profile.bio}</p>
          <div className="flex flex-wrap gap-4 pt-4"> 
            {data.profile.phone && <a href={`tel:${data.profile.phone}`} className="flex items-center gap-2 bg-cardBg hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-xl text-sm group"><Phone size={16} className="text-accentNeon"/> Contact Me</a>} 
            {data.profile.linkedin && <a href={data.profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-cardBg hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-xl text-sm group"><Linkedin size={16} className="text-accentNeon"/> LinkedIn</a>} 
            {data.profile.github && <a href={data.profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-cardBg hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-xl text-sm group"><Github size={16} className="text-accentNeon"/> GitHub</a>} 
          </div>
        </section>

        {/* Skill Matrix Framework Display */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2"> <Layers className="text-accentNeon" /> <h3 className="text-2xl font-bold text-white">Skills Matrix & Core Toolkit</h3> </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-cardBg p-5 rounded-xl border border-gray-800 hover:border-accentNeon/50 transition-all group">
                <span className="text-xs font-mono px-2 py-1 bg-darkBg rounded border border-gray-800 text-accentNeon">{skill.category}</span>
                <h4 className="text-lg font-bold text-white mt-3 group-hover:text-accentNeon transition-colors">{skill.name}</h4>
                <p className="text-gray-400 text-sm mt-1">{skill.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline Section Expansion */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2"> <Briefcase className="text-accentNeon" /> <h3 className="text-2xl font-bold text-white">Professional Experience History</h3> </div>
          <div className="space-y-8 relative before:absolute before:inset-0 before:right-auto before:left-3.5 before:w-px before:bg-gray-800">
            {(data.experience || []).map((exp) => (
              <div key={exp.id} className="relative pl-8 group animate-fade-in">
                <div className="absolute left-2.5 top-2 w-2 h-2 rounded-full bg-accentNeon border border-darkBg ring-4 ring-darkBg group-hover:scale-125 transition-transform" />
                <div className="bg-cardBg border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 mb-2">
                    <h4 className="text-lg font-bold text-white">{exp.role} <span className="text-accentNeon text-base font-normal">@ {exp.company}</span></h4>
                    <span className="text-xs font-mono bg-darkBg text-gray-400 px-2 py-0.5 rounded border border-gray-800">{exp.duration}</span>
                  </div>
                  <p className="text-gray-400 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
            {(!data.experience || data.experience.length === 0) && <p className="text-gray-500 italic text-sm">No career records registered yet.</p>}
          </div>
        </section>

        {/* Active Project Explorer Drawer Interface */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2"> <Terminal className="text-accentNeon" /> <h3 className="text-2xl font-bold text-white">QA Automation Framework Architectures</h3> </div>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="bg-cardBg rounded-xl border border-gray-800 overflow-hidden group hover:border-gray-700 transition-colors">
                <div onClick={() => { setActiveProject(activeProject === project.id ? null : project.id); setSelectedFileCode(null); setSelectedFileName(""); }} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-800/40 transition-all" >
                  <div className="space-y-2 max-w-4xl"> <h4 className="text-xl font-bold text-white group-hover:text-accentNeon transition-colors">{project.title}</h4> <p className="text-gray-400 text-sm whitespace-pre-line leading-relaxed">{project.shortDescription}</p>
                    <div className="flex gap-2 flex-wrap pt-2">
                      {project.tech.map((t, idx) => ( <span key={idx} className="text-xs bg-darkBg text-gray-300 font-mono px-2.5 py-1 rounded-md border border-gray-800">{t}</span> ))}
                    </div>
                  </div>
                  <button type="button" className="bg-darkBg text-accentNeon hover:bg-accentNeon hover:text-darkBg px-4 py-2 rounded-lg border border-gray-800 text-sm font-mono font-semibold transition-all shadow shrink-0 self-start md:self-center cursor-pointer group-hover:shadow-neon-sm"> {activeProject === project.id ? "Collapse Structural Viewer" : "Expand Code Tree Explorer"} </button>
                </div>
                {activeProject === project.id && (
                  <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-800 bg-darkBg/50 min-h-[350px]">
                    <div className="p-4 border-r border-gray-800 overflow-y-auto max-h-[500px]">
                      <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">Project Folder Hierarchy</div>
                      {renderTree(project.files)}
                    </div>
                    <div className="col-span-2 flex flex-col h-full bg-[#0d111c] min-h-[400px]">
                      <div className="text-xs font-mono text-gray-500 uppercase tracking-wider p-4 pb-2 border-b border-gray-900 flex justify-between items-center bg-[#0d111c] sticky top-0">
                        <span>Active Source File View</span> {selectedFileName && <span className="text-accentNeon lowercase font-semibold">{selectedFileName}</span>}
                      </div>
                      <div className="flex-grow font-mono text-xs overflow-auto bg-[#0d111c] border border-gray-900 shadow-inner">
                        {selectedFileCode ? (
                          <SyntaxHighlighter language={detectLanguage(selectedFileName)} style={vscDarkPlus} customStyle={{ background: 'transparent', padding: '1rem', fontSize: '13px', lineHeight: '1.6' }} lineNumberStyle={{color: '#4a5568', paddingRight: '1rem'}} showLineNumbers={true} wrapLongLines={true}>
                            {selectedFileCode}
                          </SyntaxHighlighter>
                        ) : ( <div className="p-4 text-gray-600 italic"> // Click on any file inside the directory hierarchy layout tree to inspect the raw class source code. </div> )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {data.projects.length === 0 && <p className="text-gray-500 italic text-sm">No automation frameworks uploaded yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}