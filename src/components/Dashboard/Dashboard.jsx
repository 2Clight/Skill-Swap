import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to login if not logged in
    } else {
      const fetchUserDetails = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          if (data.profilePictureUrl) {
            setProfilePicture(data.profilePictureUrl);
          }
        }
      };
      fetchUserDetails();
    }
  }, [user, navigate]);

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
    if (!file) return;

    setIsUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(
        doc(db, 'users', user.uid),
        { profilePictureUrl: downloadURL },
        { merge: true }
      );
      setProfilePicture(downloadURL);
    } catch (error) {
      console.error('Error uploading profile picture: ', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const renderProfilePicture = () => {
    if (profilePicture) {
      return <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />;
    }
    // Use random default picture if no picture is uploaded
    const defaultPictures = [
      '/assets/default1.png',
      '/assets/default2.png',
      '/assets/default3.png',
    ];
    const randomPic = defaultPictures[Math.floor(Math.random() * defaultPictures.length)];
    return <img src={randomPic} alt="Default Profile" className="w-32 h-32 rounded-full object-cover" />;
  };

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white px-6">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-teal-400">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-300 hover:text-red-400"
          >
            Logout
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          {renderProfilePicture()}
          <label
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-400"
            htmlFor="profilePictureUpload"
          >
            {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
          </label>
          <input
            id="profilePictureUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureUpload}
          />
        </div>
        <div className="mt-4">
          <Link to="/certificate" className="text-teal-400 hover:underline">
            Upload Certificate
          </Link>
        </div>
        {/* User Details */}
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

        {/* Find a Match Button */}
        <div className="mt-6">
          <button className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400">
            Find a Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
