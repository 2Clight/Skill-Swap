import React, { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user profile is complete
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().isProfileComplete) {
        // If profile is completed, navigate to the dashboard
        navigate('/dashboard');
      } else {
        // Otherwise, navigate to profile completion page
        navigate('/ProfileCompletion');
      }
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
      if (error.code !== 'auth/cancelled-popup-request') {
        alert('Failed to log in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    // If user is already logged in, check profile completion
    const checkProfileCompletion = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().isProfileComplete) {
          navigate('/dashboard'); // Redirect to dashboard if profile is completed
        } else {
          navigate('/ProfileCompletion'); // Redirect to profile completion otherwise
        }
      }
    };

    checkProfileCompletion();
  }, [navigate]);

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`w-full px-4 py-2 flex gap-2 justify-center items-center font-bold text-base text-black bg-gray-100 rounded-lg ${
        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {loading ? 'Loading...' : <><FcGoogle /> Continue with Google</>}
    </button>
  );
};

export default GoogleLogin;
