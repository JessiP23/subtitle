'use client'
import { useState } from 'react';
import axios from 'axios';

const VideoOverlayForm = () => {
  const [url, setUrl] = useState('');
  const [textColor, setTextColor] = useState('Yellow');
  const [fontSize, setFontSize] = useState('36');
  const [fontType, setFontType] = useState('Arial');
  const [xPosition, setXPosition] = useState('50');
  const [yPosition, setYPosition] = useState('80');
  const [videoUrl, setVideoUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/upload', {
        url,
        textColor,
        fontSize,
        fontType,
        xPosition,
        yPosition,
      }, { responseType: 'blob' });

      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
      setDownloadUrl(videoUrl);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Customized Video</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <label className="block">
          <span className="text-gray-700">YouTube URL:</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Text Color:</span>
          <select 
            value={textColor} 
            onChange={(e) => setTextColor(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600"
          >
            <option value="Yellow" className='text-yellow-500'>Yellow</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
            <option value="Black">Black</option>
            <option value="Purple">Purple</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Font Size:</span>
          <input 
            type="number" 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Font Type:</span>
          <select 
            value={fontType} 
            onChange={(e) => setFontType(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">X Position (1-100):</span>
          <input 
            type="number" 
            value={xPosition} 
            onChange={(e) => setXPosition(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Y Position (1-100):</span>
          <input 
            type="number" 
            value={yPosition} 
            onChange={(e) => setYPosition(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-blue-600"
          />
        </label>

        <button 
          type="submit" 
          className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Video
        </button>
      </form>

      {videoUrl && (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Customized Video</h3>
          <video controls className="mx-auto mb-4 max-w-full rounded-md shadow-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a 
            href={downloadUrl} 
            download="overlayed-video.mp4" 
            className="inline-block py-2 px-4 bg-green-500 text-white font-bold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoOverlayForm;
