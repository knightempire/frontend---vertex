import React, { useState } from 'react';
import { FaHome, FaSearch, FaUserCircle, FaBell, FaLinkedin } from 'react-icons/fa';

const Navbar = ({ onSearch }) => {
  const primaryColor = "#0073b1"; // LinkedIn-like blue
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value); // Pass the search term to parent component
  };

  return (
    <div className="bg-[#0073b1] p-4 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <FaLinkedin className="text-white text-3xl" />
          <span className="text-white text-xl font-semibold hidden sm:block">LinkedIn</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-1/3 max-w-md">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent border-none outline-none px-2 py-1"
            value={inputValue}
            onChange={handleSearch}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <FaHome className="text-white text-xl cursor-pointer" />
          <FaBell className="text-white text-xl cursor-pointer" />
          <FaUserCircle className="text-white text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
