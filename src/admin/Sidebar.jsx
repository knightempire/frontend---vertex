import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Box,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen, logo }) => {
  // Get current location to determine active menu item
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  // Check active routes
  const isDashboard = path === '/' || path === '/admin';
  const isProductsPage = path === '/products' || path === '/admin/products';
  const isUsersPage = path === '/users' || path === '/admin/users' || path.startsWith('/admin/users/profile/');
  const isRequestsPage = path === '/requests' || path === '/admin/requests';
  const isSettingsPage = path === '/settings' || path === '/admin/settings';
  
  const handleClick = () => {
    navigate('/cards');
  };


  return (
    <div className={`sidebar bg-white h-screen shadow-md transition-all duration-300 ${sidebarOpen ? 'w-50' : 'w-18'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
     <div className="flex items-center" onClick={handleClick}>
     <img src="https://images.ctfassets.net/tyqyfq36jzv2/4LDyHu4fEajllYmI8y5bj7/124bcfb1b6a522326d7d90ac1e3debc8/Linkedin-logo-png.png" alt="Logo" className="h-8 w-30 mr-2" />
   </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin" 
                className={`flex items-center p-3 rounded-md ${isDashboard ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Home size={20} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            
            {/* <li>
              <Link 
                to="/admin/products" 
                className={`flex items-center p-3 rounded-md ${isProductsPage ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Box size={20} />
                {sidebarOpen && <span className="ml-3">Products</span>}
              </Link>
            </li> */}
            
            <li>
              <Link 
                to="/admin/requests" 
                className={`flex items-center p-3 rounded-md ${isRequestsPage ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <FileText size={20} />
                {sidebarOpen && <span className="ml-3">User Requests</span>}
              </Link>
            </li>
            
            <li>
              <Link 
                to="/admin/users" 
                className={`flex items-center p-3 rounded-md ${isUsersPage ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Users size={20} />
                {sidebarOpen && <span className="ml-3">Users</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <ul className="space-y-2">
            {/* <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center p-3 rounded-md ${isSettingsPage ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Settings size={20} />
                {sidebarOpen && <span className="ml-3">Settings</span>}
              </Link>
            </li> */}
            
            <li>
              <Link 
                to="/cards" 
                className="flex items-center p-3 rounded-md hover:bg-gray-100"
              >
                <LogOut size={20} />
                {sidebarOpen && <span className="ml-3">Logout</span>}
              </Link>
            </li>
          </ul>
        </div>
        
        {sidebarOpen && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
                <span>AD</span>
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">admin@saasplatform.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;