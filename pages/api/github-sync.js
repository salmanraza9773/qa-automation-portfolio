// pages/api/github-sync.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // 1. Secure Endpoint Verification
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken || adminToken !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing token header.', error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { repoUrl, projectTitle, projectDescription, projectTech } = req.body;
      if (!repoUrl) {
        return res.status(400).json({ message: 'GitHub Repository URL is required.' });
      }

      // Parse owner and repo name from the URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        return res.status(400).json({ message: 'Invalid GitHub repository URL format. Use format: https://github.com/owner/repo' });
      }
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, '');

      // 1. Get repository details to find default branch
      const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'User-Agent': 'NextJS-Portfolio-CMS'
        }
      });

      if (!repoInfoRes.ok) {
        if (repoInfoRes.status === 404) {
          return res.status(404).json({ message: 'Repository not found. Please ensure it is public and correct.' });
        }
        if (repoInfoRes.status === 403) {
          const rateLimitRemaining = repoInfoRes.headers.get('x-ratelimit-remaining');
          if (rateLimitRemaining === '0') {
            return res.status(403).json({ message: 'GitHub API rate limit exceeded. Please try again later.' });
          }
        }
        throw new Error(`GitHub API returned status ${repoInfoRes.status}: ${repoInfoRes.statusText}`);
      }

      const repoInfo = await repoInfoRes.json();
      const defaultBranch = repoInfo.default_branch || 'main';

      // 2. Fetch the recursive git tree
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: {
          'User-Agent': 'NextJS-Portfolio-CMS'
        }
      });

      if (!treeRes.ok) {
        throw new Error(`Failed to retrieve git tree: ${treeRes.statusText}`);
      }

      const treeData = await treeRes.json();
      if (!treeData.tree || !Array.isArray(treeData.tree)) {
        throw new Error('Invalid tree data returned from GitHub API');
      }

      // 3. Construct the nested files structure
      const filesTree = {};
      for (const item of treeData.tree) {
        if (item.type === 'blob') {
          const parts = item.path.split('/');
          let current = filesTree;
          
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part] || typeof current[part] !== 'object' || current[part].isCloudFile) {
              current[part] = {};
            }
            current = current[part];
          }
          
          const fileName = parts[parts.length - 1];
          current[fileName] = {
            isCloudFile: true,
            fileName: fileName,
            rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${item.path}`
          };
        }
      }

      // 4. Load the database, append the new project, and save it
      const databasePath = path.join(process.cwd(), 'data', 'database.json');
      let database = { profile: {}, skills: [], experience: [], projects: [] };
      
      if (fs.existsSync(databasePath)) {
        const fileContent = fs.readFileSync(databasePath, 'utf8');
        try {
          database = JSON.parse(fileContent);
        } catch (e) {
          console.error("Error parsing existing database.json, initializing fresh:", e);
        }
      }

      const newProject = {
        id: `github-${Date.now()}`,
        title: projectTitle || repo,
        shortDescription: projectDescription || repoInfo.description || 'QA Automation Framework project.',
        tech: projectTech || [],
        files: filesTree
      };

      if (!database.projects) {
        database.projects = [];
      }
      database.projects.push(newProject);

      fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), 'utf8');

      return res.status(200).json({
        message: 'Framework Ingested Successfully!',
        project: newProject
      });

    } catch (error) {
      console.error("Error during GitHub sync operation:", error);
      return res.status(500).json({ message: error.message || 'GitHub synchronization pipeline hit an error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}