import React, { useState } from 'react';
import { FaHome, FaSearch, FaUserCircle, FaBell, FaLinkedin } from 'react-icons/fa';

const Nav = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (onSearch) {
      onSearch(value);
    }
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
          <FaHome className="text-white text-xl cursor-pointer hover:text-gray-200 transition-colors duration-300" />
          <FaBell className="text-white text-xl cursor-pointer hover:text-gray-200 transition-colors duration-300" />
          <FaUserCircle className="text-white text-xl cursor-pointer hover:text-gray-200 transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
};

export default Nav;
