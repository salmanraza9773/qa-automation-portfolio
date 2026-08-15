// pages/api/save-portfolio.js
export default async function handler(req, res) {
  // 1. Verify Authentication Token Header
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken || adminToken !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized token' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const updatedData = req.body;
    const repo = process.env.GITHUB_REPO; // e.g., 'salmanraza9773/qa-automation-portfolio'
    const token = process.env.GITHUB_TOKEN;
    const path = 'data/database.json'; // Path inside your repo

    if (!token || !repo) {
      return res.status(500).json({ error: 'GitHub credentials missing in Vercel environment variables.' });
    }

    // 2. Fetch the current file's SHA from GitHub API
    const getFileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    let sha = '';
    if (getFileRes.ok) {
      const fileData = await getFileRes.json();
      sha = fileData.sha;
    }

    // 3. Commit and update database.json in GitHub origin main
    const contentEncoded = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'CMS AutoSave: update portfolio database payload',
        content: contentEncoded,
        sha: sha || undefined,
        branch: 'main',
      }),
    });

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || 'Failed to commit to GitHub');
    }

    return res.status(200).json({ message: 'Portfolio changes permanently committed to GitHub!' });
  } catch (error) {
    console.error('Save error:', error);
    return res.status(500).json({ error: error.message });
  }
}