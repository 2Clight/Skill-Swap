import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleApproval = async (userId, approved) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { approved });
      alert(`User ${approved ? 'approved' : 'approval undone'} successfully!`);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, approved } : user
        )
      );
    } catch (error) {
      console.error('Error updating approval status:', error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const userDoc = doc(db, 'users', userId);
      await deleteDoc(userDoc);
      alert('User deleted successfully!');
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="p-4">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Pending Users</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-700 p-2">Name</th>
                  <th className="border-b border-gray-700 p-2">Email</th>
                  <th className="border-b border-gray-700 p-2">Certificates</th>
                  <th className="border-b border-gray-700 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => !user.approved).map(user => (
                  <tr key={user.id} className="hover:bg-gray-800">
                    <td className="p-2 border-b border-gray-700">{user.profileName || 'N/A'}</td>
                    <td className="p-2 border-b border-gray-700">{user.email}</td>
                    <td className="p-2 border-b border-gray-700">
                      {user.certificateUrl ? (
                        <a href={user.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">View Certificate</a>
                      ) : (
                        <span className="text-gray-400">No Certificate</span>
                      )}
                    </td>
                    <td className="p-2 border-b border-gray-700 flex gap-2">
                      <button 
                        onClick={() => handleApproval(user.id, true)} 
                        className={`px-2 py-1 rounded ${user.certificateUrl ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'}`} 
                        disabled={!user.certificateUrl}
                      >
                        Approve
                      </button>
                      <button className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600">Reject</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mt-6 mb-2">Approved Users</h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 p-2">Name</th>
                    <th className="border-b border-gray-700 p-2">Email</th>
                    <th className="border-b border-gray-700 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.approved).map(user => (
                    <tr key={user.id} className="hover:bg-gray-800">
                      <td className="p-2 border-b border-gray-700">{user.name || 'N/A'}</td>
                      <td className="p-2 border-b border-gray-700">{user.email}</td>
                      <td className="p-2 border-b border-gray-700 flex gap-2">
                        <button 
                          onClick={() => handleApproval(user.id, false)} 
                          className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                        >
                          Undo Approval
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
