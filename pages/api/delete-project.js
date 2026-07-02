// pages/api/delete-project.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // 1. Secure Endpoint Verification
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken || adminToken !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token header.' });
  }

  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      const filePath = path.join(process.cwd(), 'data', 'database.json');
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Filter out the selected project item
      fileData.projects = fileData.projects.filter((proj) => proj.id !== id);

      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
      return res.status(200).json({ message: 'Project entry successfully removed!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to purge project entry from database.json' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}