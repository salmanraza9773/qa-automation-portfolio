import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Missing project ID parameter.' });
  }

  try {
    const databasePath = path.join(process.cwd(), 'data', 'database.json');
    const rawData = fs.readFileSync(databasePath, 'utf8');
    const database = JSON.parse(rawData);

    // Filter out the project with the target ID
    const updatedProjects = database.projects.filter(project => project.id !== id);

    // Check if anything was actually removed
    if (database.projects.length === updatedProjects.length) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    database.projects = updatedProjects;
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), 'utf8');

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}