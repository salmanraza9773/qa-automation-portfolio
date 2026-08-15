// pages/api/analytics.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'analytics.json');

  // Initialize analytics file if missing
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ pageViews: 0, resumeDownloads: 0, projectClicks: 0 }));
  }

  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { eventType } = req.body;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (eventType === 'pageView') data.pageViews = (data.pageViews || 0) + 1;
    if (eventType === 'resumeDownload') data.resumeDownloads = (data.resumeDownloads || 0) + 1;
    if (eventType === 'projectClick') data.projectClicks = (data.projectClicks || 0) + 1;

    // Direct write for local, falls back to memory on serverless
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.warn('Analytics file write fallback:', err.message);
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}