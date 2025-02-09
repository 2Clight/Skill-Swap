import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Certificate = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // Cloudinary Upload Config
  const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dnjlyqvrx/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'skill-certificate';

  if (!user) {
    navigate('/');
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file first.');
      return;
    }
  
    setUploading(true);
    setUploadError('');
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'auto'); // Allows both images & PDFs
  
    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary Error:', errorData);
        throw new Error('Failed to upload to Cloudinary');
      }
  
      const data = await response.json();
      let certificateUrl = data.secure_url; // Default URL
  
      // 🔹 If the uploaded file is a PDF, explicitly request Cloudinary to convert it
      if (file.type === 'application/pdf') {
        const publicId = data.public_id;
        
        // Call Cloudinary to convert PDF to PNG explicitly
        certificateUrl = `https://res.cloudinary.com/dnjlyqvrx/image/upload/w_1000,f_png,pg_1/${publicId}`;
      }
  
      // Save converted URL to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { certificateUrl });
  
      alert('Certificate uploaded successfully!');
      navigate('/dashboard');
    } catch (error) {
      setUploadError('Error uploading file. Please try again.');
      console.error('Upload Error:', error);
    } finally {
      setUploading(false);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white px-6">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 mt-10">
        <h1 className="text-2xl font-bold text-teal-400 mb-4">Upload Certificate</h1>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-gray-300 mb-4"
        />

        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

        <button
          onClick={handleUpload}
          className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </button>
      </div>
    </div>
  );
};

export default Certificate;
