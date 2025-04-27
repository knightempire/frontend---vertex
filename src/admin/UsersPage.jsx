import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  ChevronDown, 
  Filter, 
  CheckCircle, 
  XCircle,
  X
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import UserProfile from './UserProfile';
import logo from '../assets/vertx.png';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'profile'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser , setNewUser ] = useState({ name: '', email: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [usersPerPage] = useState(10); // Number of users per page
  const [statusFilter, setStatusFilter] = useState('All');
  const [joinedDateFilter, setJoinedDateFilter] = useState('All Time');
  const [emailError, setEmailError] = useState(''); 
  const [userError, setUserError] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("vertx");
    console.log("Token from localStorage:", tokenFromStorage);
  
    if (!tokenFromStorage) {
      navigate('/login');
      return;
    }
  
    const parsedToken = JSON.parse(tokenFromStorage);
    setToken(parsedToken.token);
    console.log("Extracted token:", parsedToken.token);
  }, [navigate]);
  
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);
  
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log('Token verified successfully:', response);
        getUsers(token);
        getProducts();
      } else {
        console.log('Token verification failed:', response);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str; // Handle if the string is empty or null
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getUsers = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/display`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
  
      const data = await response.json();
      console.log(data);

      const updatedUsers = data.users.map(user => ({
        ...user,
        name: capitalizeFirstLetter(user.name),  // Capitalize the first letter of name
      }));
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query
  };

  const filteredUsers = (users || [])
    .filter((user) => {
      return (
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .filter((user) => {
      if (statusFilter === 'All') return true;
      return statusFilter === 'Active' ? user.isActive : !user.isActive;
    })
    .filter((user) => {
      if (selectedProducts.length === 0) return true; // Show all users if no product is selected
      // Check if product_access is not null before filtering
      return user.product_access && user.product_access.some((product) =>
        selectedProducts.includes(product.product_name) && product.accessGranted === true
      );
    })
    .filter((user) => {
      if (joinedDateFilter === 'All Time') return true;
      const joinedDate = new Date(user.created);
      const today = new Date();
      const diffInDays = Math.floor((today - joinedDate) / (1000 * 60 * 60 * 24));
      switch (joinedDateFilter) {
        case 'Last 30 days':
          return diffInDays <= 30;
        case 'Last 90 days':
          return diffInDays <= 90;
        case 'Last 6 months':
          return diffInDays <= 180;
        case 'Last year':
          return diffInDays <= 365;
        default:
          return true;
      }
    });

  const indexOfLastUser   = currentPage * usersPerPage;
  const indexOfFirstUser   = indexOfLastUser   - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser  , indexOfLastUser  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const getProducts = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/display`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProfileClick = (user) => {
    console.log('User  ID:', user.id);
    navigate(`/admin/users/profile/${user.id}`);
  };
  
  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isActive: !user.isActive
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleProductFilterChange = (productName) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productName)) {
        return prevSelectedProducts.filter((product) => product !== productName);
      } else {
        return [...prevSelectedProducts, productName];
      }
    });
  };

  const handleJoinedDateFilterChange = (event) => {
    setJoinedDateFilter(event.target.value);
  };
 
  const handleResetFilters = () => {
    setStatusFilter('All');
    setSelectedProducts([]);
    setJoinedDateFilter('All Time');
  };
  
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser (null);
  };

  const handleAddUser  = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!emailRegex.test(newUser .email)) {
      setEmailError("Please enter a valid email address.");
      return; // Prevent further execution
    }
  
    // Prepare data for the request
    const userData = {
      new_name: newUser .name,
      new_username: newUser .email, 
      new_role: newUser .role || "user", 
    };
  
    try {
      console.log("add", token);
      // Send POST request to the API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData), // Send the user data in the body
      });
  
      // Check if the request was successful
      if (response.ok) {
        console.log('User  added successfully:', newUser );
        setShowAddModal(false);
        setNewUser ({ name: '', email: '', role: 'user' }); // Reset form
        setShowAlert(true); // Show success alert
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        // Handle error response (non-2xx status)
        const errorData = await response.json();
        console.error('Error adding user:', errorData);
  
        if (errorData.message === 'Username already exists') {
          setUserError('The email address is already in use.');
        } else {
          setUserError('Failed to add user. Please try again.');
        }
        setEmailError(''); // Clear email error if the username already exists
      }
    } catch (error) {
      // Catch any network or unexpected errors
      console.error('Network error:', error);
      setEmailError('An error occurred while adding the user. Please try again.');
    } finally {
      setEmailError(''); // Reset email error if request is done
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser (prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render appropriate content based on view mode
  const renderContent = () => {
    if (viewMode === 'profile' && selectedUser ) {
      return (
        <UserProfile 
          user={selectedUser } 
          onClose={handleBackToList} 
          toggleUserStatus={toggleUserStatus}
        />
      );
    }

    // Default: List view
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        {/* Success Alert */}
        {showAlert && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center z-50">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>User Added Successfully!</span>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-4 text-green-700 hover:text-green-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add New User
          </button>
        </div>
        
        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UsersIcon size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium">All Users</h2>
            </div>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
            >
              <Filter size={16} className="mr-1" />
              <span>Filters</span>
              <ChevronDown size={16} className={`ml-1 transform transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {filterOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              {/* Product Access Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Access</label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={selectedProducts}
                  onChange={(e) => handleProductFilterChange(e.target.value)}
                >
                  <option value="">Select Products</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Joined Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={joinedDateFilter}
                  onChange={handleJoinedDateFilterChange}
                >
                  <option>All Time</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>

              {/* Apply & Reset Buttons */}
              <div className="flex items-end">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Search Box */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users by name, email or company..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Products
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {user.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">Joined {user.created}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.isActive ? (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                        {(user.product_access && user.product_access.filter((p) => p.accessGranted).length) || 0} of {products.length}

                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleProfileClick(user)}
                          className="text-indigo-600 hover:text-indigo-900 ml-4"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No users found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{indexOfFirstUser  + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser , users.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> users
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  {[...Array(totalPages)].map((_, index) => (
                    <a
                      key={index}
                      href="#"
                      onClick={() => handlePageChange(index + 1)}
                      className={`z-10 ${
                        currentPage === index + 1
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                    >
                      {index + 1}
                    </a>
                  ))}
                  <a
                    href="#"
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-300 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New User</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newUser .name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={newUser .email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter email address"
              />

              {/* Show the email error message if there's one */}
              {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={newUser .role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="user">User </option>
                <option value="master_admin">Master Admin</option>
              </select>
            </div>

            {/* Display the error message if username already exists */}
            {userError && <p className="text-red-500 text-sm mt-2">{userError}</p>}

            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="mr-3 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser }
                disabled={!newUser .name || !newUser .email}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${newUser .name && newUser .email ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;