import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import Navbar from './Navbar'; // Assuming you have a Navbar component
import UserProfile from './UserProfile'; // Assuming you have this UserProfile component
import logo from '../assets/linkendin.png';

const UsersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [selectedUser, setSelectedUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch token from localStorage and set it
  useEffect(() => {
    const storedData = localStorage.getItem('linkendin');
    const parsed = storedData && JSON.parse(storedData);
    const token = parsed?.token;
    if (token) {
      setToken(token);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch users from the API
  useEffect(() => {
    if (token) {
      getUsers(token);
    }
  }, [token]);

  const getUsers = async (token) => {
    setLoading(true); // Set loading to true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched users:', data); // Log the fetched users to the console
      setUsers(data); // Assuming the API returns the user data directly
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  const handleProfileClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  // Render appropriate content based on whether a user is selected
  const renderContent = () => {
    if (selectedUser) {
      return (
        <UserProfile
          user={selectedUser}
          onClose={handleBackToList}
        />
      );
    }

    // Default: List view
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.isActive ? 'Active' : 'Inactive'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleProfileClick(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        logo={logo} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content with Scrolling */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
