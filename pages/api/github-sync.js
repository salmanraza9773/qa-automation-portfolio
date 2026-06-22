import fs from 'fs';
import path from 'path';

function buildNestedTree(flatFiles, owner, repo, branch) {
  const root = {};
  
  flatFiles.forEach(file => {
    if (file.type === 'blob') {
      const parts = file.path.split('/');
      let current = root;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // Instead of a placeholder string, we store a structured metadata pointer object
          current[part] = {
            isCloudFile: true,
            fileName: part,
            rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`
          };
        } else {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    }
  });
  
  return root;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { repoUrl, projectTitle, projectDescription, projectTech } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ message: 'Missing Repository URL configuration' });
  }

  try {
    const urlParts = repoUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    if (!owner || !repo) {
      return res.status(400).json({ message: 'Invalid GitHub URL format.' });
    }

    const repoInfoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoInfoResponse.ok) throw new Error('Failed to find matching GitHub repository info.');
    const repoInfo = await repoInfoResponse.json();
    const defaultBranch = repoInfo.default_branch || 'main';

    const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
    if (!treeResponse.ok) throw new Error('Failed to retrieve file tree matrix.');
    const treeData = await treeResponse.json();

    // Pass owner, repo, and branch to generate clean raw file pointers
    const processedTree = buildNestedTree(treeData.tree, owner, repo, defaultBranch);

    const databasePath = path.join(process.cwd(), 'data', 'database.json');
    const existingRawData = fs.readFileSync(databasePath, 'utf8');
    const currentDatabase = JSON.parse(existingRawData);

    const newProjectId = `github-${Date.now()}`;
    const newProjectEntry = {
      id: newProjectId,
      title: projectTitle || repo,
      shortDescription: projectDescription || `Automated codebase sync framework tracking branch: ${defaultBranch}`,
      tech: projectTech || ["GitHub Sync", "Automation Framework"],
      files: processedTree
    };

    currentDatabase.projects.push(newProjectEntry);
    fs.writeFileSync(databasePath, JSON.stringify(currentDatabase, null, 2), 'utf8');

    return res.status(200).json({ message: 'Success', project: newProjectEntry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}