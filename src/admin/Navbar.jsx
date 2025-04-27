import React from 'react';
import { 
  Bell, 
  MessageSquare
} from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100">
            <MessageSquare size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;