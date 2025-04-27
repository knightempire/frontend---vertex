import React, { useState } from 'react';
import { FaHome, FaSearch, FaUserCircle, FaBell, FaLinkedin, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Navbar = ({ onSearch }) => {
  const primaryColor = "#0073b1"; // LinkedIn-like blue
  const [inputValue, setInputValue] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State to control profile dropdown visibility
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value); // Pass the search term to parent component
  };

  // Toggle the profile dropdown menu
  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  // Simulate logout (you can replace this with actual logout functionality)
  const handleLogout = () => {
    alert('Logging out...');
    // You can implement actual logout logic here (e.g., clearing session, redirecting, etc.)
  };

  return (
    <div className="bg-[#0073b1] p-4 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <FaLinkedin className="text-white text-3xl" />
          <span className="text-white text-2xl font-bold hidden sm:block">LinkedIn</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-1/3 max-w-lg shadow-md focus-within:ring-2 focus-within:ring-blue-600">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent border-none outline-none px-2 py-1 text-sm font-medium"
            value={inputValue}
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          {/* Home Icon - Navigate to /feed */}
          <FaHome 
            className="text-white text-xl cursor-pointer hover:text-gray-200 transition-colors duration-300" 
            onClick={() => navigate('/feed')} // Navigate to /feed when clicked
          />

          <FaBell className="text-white text-xl cursor-pointer hover:text-gray-200 transition-colors duration-300" />

          {/* Profile Icon */}
          <div className="relative">
            <FaUserCircle
              className="text-white text-xl cursor-pointer hover:text-gray-200 transition-colors duration-300"
              onClick={toggleProfileMenu}
            />
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 py-2 z-50">
                <button
                  onClick={() => navigate('/profile')} // Navigate to profile when clicked
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                >
                        <FaUserCircle className="inline mr-2" />

                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
