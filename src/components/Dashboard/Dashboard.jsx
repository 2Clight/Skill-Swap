import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SideBar from '../SideBar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState("/assets/default1.png");
  const [skillsData, setSkillsData] = useState([]);
  const [studentsTaught, setStudentsTaught] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selfDescription, setSelfDescription] = useState('');
  const [matchedUsers, setMatchedUsers] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  // Cloudinary Config
  const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dnjlyqvrx/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'skill-certificate';
  const CLOUDINARY_CLOUD_NAME = 'dnjlyqvrx';

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

            setIsActive(data.active || false);
            setSelfDescription(data.selfDescription || '');
            setMatchedUsers(data.matchedUsers || 0);

            if (data.skillsProgress) {
              setSkillsData(Object.entries(data.skillsProgress).map(([date, count]) => ({ date, count })));
            }
            setStudentsTaught(data.studentsTaught || 0);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const toggleActiveStatus = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { active: newStatus });
    }
  };

  const handleDescriptionChange = async (e) => {
    const newDescription = e.target.value;
    setSelfDescription(newDescription);
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { selfDescription: newDescription });
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
      <SideBar />
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

        <div className="mt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={toggleActiveStatus}
              className="w-5 h-5"
            />
            <span className="text-lg font-semibold">Active Status</span>
          </label>
        </div>

        <div className="mt-6">
          <label className="text-lg font-semibold text-teal-400">About Me</label>
          <textarea
            value={selfDescription}
            onChange={handleDescriptionChange}
            rows="4"
            placeholder="Write something about yourself..."
            className="w-full mt-2 p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
          />
        </div>

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold text-teal-400">Progress Overview</h2>
          
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">Users Matched</p>
            <p className="text-3xl font-bold text-teal-400">{matchedUsers}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">People Taught</p>
            <p className="text-3xl font-bold text-teal-400">{studentsTaught}</p>
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
