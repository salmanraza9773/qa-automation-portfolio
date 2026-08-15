// pages/api/analytics.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'analytics.json');

  // Ensure default metrics schema exists
  const defaultData = {
    pageViews: 0,
    projectClicks: 0,
    videoViews: 0,
    blogViews: 0,
    contactClicks: 0
  };

  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    } catch (e) {}
  }

  if (req.method === 'GET') {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return res.status(200).json({ ...defaultData, ...data });
    } catch (err) {
      return res.status(200).json(defaultData);
    }
  }

  if (req.method === 'POST') {
    const { eventType } = req.body;
    let data = { ...defaultData };
    try {
      data = { ...data, ...JSON.parse(fs.readFileSync(filePath, 'utf8')) };
    } catch (e) {}

    if (eventType === 'pageView') data.pageViews = (data.pageViews || 0) + 1;
    if (eventType === 'projectClick') data.projectClicks = (data.projectClicks || 0) + 1;
    if (eventType === 'videoView') data.videoViews = (data.videoViews || 0) + 1;
    if (eventType === 'blogView') data.blogViews = (data.blogViews || 0) + 1;
    if (eventType === 'contactClick') data.contactClicks = (data.contactClicks || 0) + 1;

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.warn('Analytics file write fallback:', err.message);
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}