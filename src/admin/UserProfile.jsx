import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle,
  User,
  Calendar,
  Shield,
  ArrowLeft,
  ChevronDown,
  Plus,
  Send  
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import logo from '../assets/vertx.png';
import { useNavigate } from 'react-router-dom';


// All available products for dropdown
const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser ] = useState(null);
  const [accessHistory, setAccessHistory] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [token, setToken] = useState(null);


  const capitalizeFirstLetter = (str) => {
    if (!str) return str; // Handle if the string is empty or null
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const navigate = useNavigate();

  // Fetch the token and verify it
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("vertx");

    if (!tokenFromStorage) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    const parsedToken = JSON.parse(tokenFromStorage);
    setToken(parsedToken.token);
  }, [navigate]);

  // Helper function to verify the token
  const verifyToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log('Token verification failed');
        navigate('/login'); // Redirect to login if token is invalid
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      navigate('/login');
      return false;
    }
  };

  // Fetch user details
  useEffect(() => {
    const getUserDetail = async () => {
      if (!token) return; // Ensure token exists before making the request

      const userId = window.location.pathname.split('/')[4]; // Extract userId from URL
      console.log('User Details:', userId); // Log userId to ensure it's correct

      try {
        // Verify token before making the request
        const isTokenValid = await verifyToken();
        if (!isTokenValid) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        console.log(data);

        const fetchedUser = {
          id: data.user.id,
          name: capitalizeFirstLetter(data.user.name),
          username: data.user.username,
          company: data.user.company || "N/A", // Assuming company is not in the API response
          joined: data.user.created,
          status: data.user.isActive ? "Active" : "Inactive",
          products: data.user.product_access.map(product => ({
            id: product.product_id,
            name: product.product_name,
            access: product.accessGranted,
          })),
        };

        setUser(fetchedUser);

        if (data.user.product_access_requests) {
          const history = data.user.product_access_requests.flatMap((productRequest, productIndex) =>
            productRequest.requests.map((request, requestIndex) => ({
              id: `${productIndex + 1}-${requestIndex + 1}`,
              productName: productRequest.productName,
              requestedDate: request.requestDate,
              approvedDate: request.approvedDate || null,
              status: request.status || "pending",
              comment: request.comment || "No comment",
            }))
          );

          console.log('Access History:', history);
          setAccessHistory(history);
        }

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetail();
  }, [token]);

  // Fetch all products
  useEffect(() => {
    const getProducts = async () => {
      if (!token) return; // Ensure token exists before making the request

      try {
        // Verify token before making the request
        const isTokenValid = await verifyToken();
        if (!isTokenValid) return;

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
        console.log('Products from API:', data);
        setAllProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, [token]);

  // Handle toggling product access
  const handleToggleAccess = async (productId) => {
    const userId = window.location.pathname.split('/')[4]; // Extract userId from URL directly
    console.log(`Toggling access for userId: ${userId}, productId: ${productId}`);

    const product = user.products.find(p => p.id === productId);
    const newStatus = product.access ? 0 : 1; // Toggle the status

    const requestBody = {
      product_id: productId,
      status: newStatus,
    };

    try {
      // Verify token before making the request
      const isTokenValid = await verifyToken();
      if (!isTokenValid) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/update/product/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update product access');
      }

      const data = await response.json();
      console.log('Access updated successfully:', data);

      setUser(prevUser => ({
        ...prevUser,
        products: prevUser.products.map(product =>
          product.id === productId ? { ...product, access: newStatus === 1 } : product
        ),
      }));

    } catch (error) {
      console.error('Error updating product access:', error);
    }
  };

  // Handle toggling user status
  const handleToggleUserStatus = async (userId) => {
    console.log(userId);
    const newStatus = user.status === 'Active' ? 0 : 1; // Toggle status

    try {
      // Verify token before making the request
      const isTokenValid = await verifyToken();
      if (!isTokenValid) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/status/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const data = await response.json();
      console.log('User status updated successfully:', data);

      setUser(prevUser => ({
        ...prevUser,
        status: newStatus === 1 ? 'Active' : 'Inactive',
      }));

    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Filter out products the user already has access to
  const availableProducts = allProducts.filter(product => {
    const userProduct = user?.products.find(p => p.id === product.id);
    return !userProduct || (userProduct && !userProduct.access);
  });

  // Handle granting access to a product
  const handleAddAccess = (productId) => {
    setSelectedProduct(productId);
    setIsConfirmationModalOpen(true); // Open confirmation modal
  };

  const confirmAddAccess = async () => {
    const productToAdd = allProducts.find(p => p.id === selectedProduct);
    const today = new Date().toISOString().split('T')[0];
    const newHistoryEntry = {
      id: accessHistory.length + 1,
      productName: productToAdd.name,
      requestedDate: today,
      approvedDate: today,
      status: "approved",
    };

    const requestBody = {
      product_id: selectedProduct,
    };

    try {
      const userId = window.location.pathname.split('/')[4]; // Extract userId from URL
      // Verify token before making the request
      const isTokenValid = await verifyToken();
      if (!isTokenValid) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/product/add/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update product access');
      }

      const data = await response.json();
      console.log('Access granted successfully:', data);

      setUser(prevUser => ({
        ...prevUser,
        products: [...prevUser.products, { id: productToAdd.id, name: productToAdd.name, access: true }],
      }));

      setIsConfirmationModalOpen(false); // Close confirmation modal
    } catch (error) {
      console.error('Error granting product access:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const onBack = () => {
    navigate('/admin/users'); // Redirects to the /user page
  };


  if (!user) return null; // Show loading state while fetching user data

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
          <div className="p-6 bg-gray-50 min-h-full">
            <div className="flex items-center mb-6">
              <button 
                onClick={onBack} 
                className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
              >
                <ArrowLeft size={20} className="mr-1" />
                <span>Back to Users</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Info Column */}
              <div className="col-span-1 space-y-4">
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
                  <div className="flex items-center">
                    <User  className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Send className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{user.username}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Joined</div>
                      <div className="font-medium">{user.joined}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Edit User
                  </button>
                  
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Reset Password
                  </button>
                  
                  <button 
                    onClick={() => handleToggleUserStatus(user.id)} 
                    className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      user.status === 'Active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                    }`}
                  >
                    {user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                  </button>
                </div>
              </div>
              
              {/* Product Access Column */}
              <div className="col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
  <div className="border-b px-4 py-3 bg-gray-50 flex justify-between items-center">
    <div>
      <h3 className="text-lg font-medium text-gray-800">Product Access</h3>
      <p className="text-sm text-gray-500">Manage which products this user can access</p>
    </div>
    
    {/* Add Access Dropdown */}
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={availableProducts.length === 0}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Access
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      
      {/* Dropdown Menu */}
      {dropdownOpen && availableProducts.length > 0 && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* Filter out products already assigned to the user */}
            {availableProducts
              .filter((product) => {
                // Check if product is already assigned with access to the user
                const isAlreadyAssigned = user.products.some(
                  (userProduct) => userProduct.id === product.id 
                );
                return !isAlreadyAssigned; // Exclude products that are already assigned
              })
              .map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product.id);
                    setIsConfirmationModalOpen(true); // Open confirmation modal
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {product.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  </div>
  
  <div className="p-4">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Product
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Access
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {user.products.map((product) => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{product.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => handleToggleAccess(product.id)}
                className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  product.access
                    ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'
                }`}
              >
                {product.access ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Yes
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    No
                  </>
                )}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

                
                {/* User History Table */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="border-b px-4 py-3 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-800">User  History</h3>
                    <p className="text-sm text-gray-500">Product access request and approval history</p>
                  </div>
                  
                  <div className="p-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requested Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Approved Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {accessHistory.map((history) => (
                          <tr key={history.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {history.productName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(history.requestedDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(history.approvedDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                history.status === 'approved' 
                                  ? 'bg-green-100 text-green-800' 
                                  : history.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {history.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Confirm Add Access</h3>
                <button 
                  onClick={() => setIsConfirmationModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 py-4">
                <p>Are you sure you want to grant access to {selectedProduct?.name}?</p>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                <button
                  onClick={() => setIsConfirmationModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddAccess}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;