import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, title, shortDescription, tech } = req.body;

  if (!id || !title) {
    return res.status(400).json({ message: 'Missing required project ID or Title.' });
  }

  try {
    const databasePath = path.join(process.cwd(), 'data', 'database.json');
    const rawData = fs.readFileSync(databasePath, 'utf8');
    const database = JSON.parse(rawData);

    // Find the project index by ID
    const projectIndex = database.projects.findIndex(project => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Modular Update: Update only the metadata fields
    database.projects[projectIndex] = {
      ...database.projects[projectIndex], // Preserve files structure
      title,
      shortDescription,
      tech: Array.isArray(tech) ? tech : tech.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), 'utf8');

    return res.status(200).json({ message: 'Project updated successfully', project: database.projects[projectIndex] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}