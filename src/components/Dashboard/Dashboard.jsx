import React, { useEffect, useState } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState("/assets/default1.png");
  const [isUploading, setIsUploading] = useState(false);
  const [skillsData, setSkillsData] = useState([]);
  const [studentsTaught, setStudentsTaught] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();

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

            // Process skills progress
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
          <p className="text-lg mt-4 font-semibold text-teal-400">{userDetails.profileName}</p>
        </div>

        <div className="mt-4">
          <Link to="/certificate" className="text-teal-400 hover:underline">Upload Certificate</Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-teal-400">Progress Overview</h2>
          
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">People Taught</p>
            <p className="text-3xl font-bold text-teal-400">{studentsTaught}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-teal-400">Skills Learned Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillsData}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-teal-400">Overall Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={skillsData}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="count" stroke="#14b8a6" />
              </LineChart>
            </ResponsiveContainer>
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
