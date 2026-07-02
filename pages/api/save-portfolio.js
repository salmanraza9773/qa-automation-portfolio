// pages/api/save-portfolio.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // 1. Intercept the incoming request and check for the authorization header
  const adminToken = req.headers['x-admin-token'];

  // 2. Validate it against your server-side environment variable
  if (!adminToken || adminToken !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token header.' });
  }

  // 3. If verified, proceed with saving your file data safely
  if (req.method === 'POST') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'database.json');
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      return res.status(200).json({ message: 'Portfolio database securely written!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to write data to database.json' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}