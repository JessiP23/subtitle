// pages/api/upload.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post('http://localhost:5000/upload', req.body);
      // Assuming the Flask API returns the file as an attachment
      res.setHeader('Content-Type', 'video/mp4');
      res.send(response.data);
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).json({ error: 'Error uploading video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
