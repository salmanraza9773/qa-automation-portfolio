import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const databasePath = path.join(process.cwd(), 'data', 'database.json');
    const updatedData = req.body;

    if (!updatedData || !updatedData.profile || !updatedData.skills) {
      return res.status(400).json({ message: 'Invalid dataset structural schema payload.' });
    }

    // Atomically save the entire updated layout tree to disk
    fs.writeFileSync(databasePath, JSON.stringify(updatedData, null, 2), 'utf8');
    return res.status(200).json({ message: 'Database committed successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}