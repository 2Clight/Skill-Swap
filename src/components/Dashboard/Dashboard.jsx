import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState("/assets/default1.png");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const CLOUDINARY_UPLOAD_PRESET = 'profile-picture';
  const CLOUDINARY_CLOUD_NAME = 'dnjlyqvrx';
  const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dnjlyqvrx/image/upload';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);
            setProfilePicture(data.profilePictureUrl || "/assets/default1.png");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        navigate('/'); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.secure_url) throw new Error("Upload failed");

      await setDoc(
        doc(db, 'users', user.uid),
        { profilePictureUrl: data.secure_url },
        { merge: true }
      );

      setProfilePicture(data.secure_url);
      setUserDetails((prev) => ({ ...prev, profilePictureUrl: data.secure_url }));
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user || !userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white px-6">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-teal-400">Dashboard</h1>
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-300 hover:text-red-400">
            Logout
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          <label className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-400" htmlFor="profilePictureUpload">
            {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
          </label>
          <input id="profilePictureUpload" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
        </div>

        <div className="mt-4">
          <Link to="/certificate" className="text-teal-400 hover:underline">Upload Certificate</Link>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-teal-400">Profile Name:</h2>
            <p className="text-gray-300">{userDetails.profileName}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-teal-400">Gender:</h2>
            <p className="text-gray-300">{userDetails.gender}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-teal-400">Country:</h2>
            <p className="text-gray-300">{userDetails.country}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-teal-400">Possessed Skills:</h2>
            <ul className="list-disc ml-6 text-gray-300">
              {userDetails.possessedSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-teal-400">Skills to Learn:</h2>
            <ul className="list-disc ml-6 text-gray-300">
              {userDetails.skillsToLearn.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={() => navigate('/HomePage')} className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400">
            Find a Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
