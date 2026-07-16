// pages/api/get-portfolio.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'database.json');
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Database file not found.' });
      }
      const fileData = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json(JSON.parse(fileData));
    } catch (error) {
      return res.status(500).json({ error: 'Failed to read data from database.json' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
