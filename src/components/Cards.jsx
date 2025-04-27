import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/linkendin.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [requestMade, setRequestMade] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true); // New state to track visibility
  const bgColor = "#f6f8fa";
  const cardBgColor = "#ffffff";
  const primaryBlue = "#0046ad";
  const grayText = "#666666";

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("linkendin");
    console.log("Token from localStorage:", tokenFromStorage);
  
    if (!tokenFromStorage) {
      navigate('/login');
      return;
    }
  
    let token = null;
    if (tokenFromStorage) {
      const parsedToken = JSON.parse(tokenFromStorage);
      setToken(parsedToken.token);
      token = parsedToken.token;
      console.log("Extracted token:", parsedToken.token);

      const decodedName = atob(parsedToken.name);
      setUsername(decodedName);
    }
  
    const verifyToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/verify-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (response.ok) {
          const contentType = response.headers.get("Content-Type");
    
          if (contentType && contentType.includes("application/json")) {
            const textResponse = await response.text();
    
            if (textResponse) {
              try {
                const data = JSON.parse(textResponse);
                console.log("Token verification result:", data);
    
                const user = data.user;
    
                if (user.isActive === false) {
                  localStorage.removeItem("linkendin");
                  setToken(null);
                  console.log("Token removed from localStorage due to inactive user");
                  navigate('/');
                  return;
                }
    
                
                if (response.status === 201) {
                  const updatedToken = data.token;  // Initialize updatedToken here
                  setToken(updatedToken);  // Update state with the new token
                  const base64Name = btoa(data.user.name);
                  localStorage.setItem('linkendin', JSON.stringify({ token: updatedToken, name: base64Name }));
                  console.log("Token updated in localStorage:", updatedToken);
                }
    
                setUser(user);
                // Fetch the view request data
                const viewRequestResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/product/view-request`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Use the updated token here
                  },
                });
    
                const viewRequestText = await viewRequestResponse.text();
                let viewRequestData = [];
    
                if (viewRequestText) {
                  try {
                    viewRequestData = JSON.parse(viewRequestText);
                    console.log("View request data:", viewRequestData);
    
                    // Check if viewRequestData has a 'requests' array
                    if (viewRequestData && Array.isArray(viewRequestData.requests)) {
                      // If 'requests' is an array, use it
                      viewRequestData = viewRequestData.requests;
                      console.log("viewRequestData is an array:", viewRequestData);
                    } else {
                      console.error("Expected 'requests' to be an array, but got:", typeof viewRequestData);
                      viewRequestData = [];
                    }
                  } catch (jsonError) {
                    console.error("Error parsing view request response:", jsonError);
                    console.log("View Request Response Text:", viewRequestText);
                  }
                } else {
                  console.log("View request response is empty");
                }
    
                // Fetch product data
                const productResponse = await fetch(`${import.meta.env.VITE_API_URL}/products/display`);
                const productsText = await productResponse.text();
                if (productsText) {
                  const productsData = JSON.parse(productsText);
                  console.log("API Response:", productsData);
    
                  const mockProducts = [
                    // mock products array
                  ];
    
                  const productAccess = user.product_access || [];
    
                  const combinedProducts = productsData.products.map(product => {
                    const matchingMockProduct = mockProducts.find(mockProduct => mockProduct.name === product.name);
                    const accessGrantedProduct = productAccess.find(access => access.product_id === product.id);
                    const viewRequest = viewRequestData.find(req => req.product_id === product.id);
    
                    return {
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      url: product.url,
                      version: product.version,
                      iconBackground: matchingMockProduct ? matchingMockProduct.iconBackground : '#d4d6d8',
                      iconColor: matchingMockProduct ? matchingMockProduct.iconColor : '#333333',
                      icon: matchingMockProduct ? matchingMockProduct.icon : <svg width="24" height="24" fill="#333333"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v6l4 2v-2h-4V6z"/></svg>,
                      accessGranted: accessGrantedProduct ? accessGrantedProduct.accessGranted : null,
                      status: viewRequest ? viewRequest.status : null,
                    };
                  });
    
                  console.log("Combined products:", combinedProducts);
                  setProducts(combinedProducts);
                } else {
                  console.error("Product response is empty");
                }
              } catch (jsonError) {
                console.error("Error parsing JSON response:", jsonError);
                console.log("Response Text: ", textResponse);
              }
            } else {
              console.error("Empty response body received");
            }
          } else {
            console.error("Response is not in JSON format. Content-Type:", contentType);
          }
        } else if (response.status === 401) {
          // Token is invalid, so navigate to login page
          localStorage.removeItem("linkendin");
          setToken(null);
          navigate('/login');
          console.error("Token is not valid! Redirecting to login.");
        } else {
          console.error("Token verification failed with status:", response.status);
          const errorText = await response.text();
          console.error("Error response body:", errorText);
        }
      } catch (error) {
        navigate('/login');
        console.error('Error verifying token:', error);
      }
    };

    verifyToken();
  }, [navigate, requestMade]); // Add requestMade to the dependency array

  // Handle visibility change or focus events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setPageVisible((prev) => !prev); // Toggle to trigger useEffect
      }
    };

    const handleFocus = () => {
      setPageVisible((prev) => !prev); // Toggle to trigger useEffect
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Handle product access request
  const handleRequestAccess = async (product) => {
    console.log(`Requesting access for ${product.id}`);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/product/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Access request successful:', data);
        setRequestMade((prev) => !prev); // Toggle to trigger useEffect
      } else {
        const errorData = await response.json();
        console.log('Access request failed:', errorData);
      }
    } catch (error) {
      console.error('Error making access request:', error);
    }
  };

  const handleLaunch = (product) => {
    console.log("tokentaken", token);
    const urlWithToken = `${product.url}?token=${token}`;
    window.open(urlWithToken, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem("linkendin");
    setToken(null);
    navigate('/');
  };

  const ProductIcon = ({ product }) => (
    <div 
      className="flex items-center justify-center h-10 w-10 rounded text-center"
      style={{ 
        backgroundColor: product.iconBackground, 
        color: product.iconColor
      }}
    >
      {product.icon}
    </div>
  );


    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
   
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    
  return (
    <div className="min-h-screen flex flex-col" style={{ background: bgColor }}>
      {/* Header */}
      <header className="py-3 px-6 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <img src="https://images.ctfassets.net/tyqyfq36jzv2/4LDyHu4fEajllYmI8y5bj7/124bcfb1b6a522326d7d90ac1e3debc8/Linkedin-logo-png.png" alt="Company Logo" className="h-10" />
        </div>
        <div className="flex items-center">
          <div className="relative mx-4">
            <input
              type="text"
              placeholder="Type here..."
              className="px-3 py-1 pr-10 border border-gray-200 rounded-md text-sm w-full"
              style={{ minWidth: '180px' }}
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
         
          {/* User Dropdown */}
          <div id="user-dropdown" className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            >
              <span className="mr-2">Hi, {username}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
           
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-6 px-6 flex-grow">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {user?.role === "master_admin" && (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        style={{ minHeight: '180px' }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {/* Admin Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-800">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                <path d="M12 6v6l4 2v-2h-4V6z"></path>
              </svg>
              <h3 className="font-medium text-gray-800 ml-2">Admin Dashboard</h3>
            </div>
          </div>
          <div className="mt-2 mb-4 flex-grow">
            <p className="text-sm text-gray-600 leading-relaxed">
              Access the admin dashboard to manage users and system configurations.
            </p>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <button
              onClick={() => navigate('/admin')}
              className="w-full py-2 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium flex items-center justify-center transition duration-150"
            >
              Go to Admin Dashboard <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    )}


          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              style={{ minHeight: '180px' }}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex">
                    <ProductIcon product={product} />
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">{product.name}</h3>
                      <div className="text-xs text-gray-500 mt-0.5">{product.version}</div>
                    </div>
                  </div>
                  {product.accessGranted === true || (product.accessGranted === null && product.status === 'approved') ? (
                    <div className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      Available
                    </div>
                  ) : product.accessGranted === false ? (
                    <div className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                      Restricted
                    </div>
                  ) : product.accessGranted === null ? (
                    product.status === 'pending' ? (
                      <div className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                        Request
                      </div>
                    )
                  ) : (
                    <div className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                      Restricted
                    </div>
                  )}
                </div>
                <div className="mt-2 mb-4 flex-grow">
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  {product.accessGranted === true || (product.accessGranted === null && product.status === 'approved') ? (
                    <button
                      onClick={() => handleLaunch(product)}
                      className="w-full py-2 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium flex items-center justify-center transition duration-150"
                    >
                      Open Application <span className="ml-2">→</span>
                    </button>
                  ) : product.accessGranted === false ? (
                    <div className="w-full py-2 text-gray-500 text-sm flex items-center justify-center">
                      You don't have access <span className="ml-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                    </div>
                  ) : product.accessGranted === null ? (
                    product.status === 'pending' ? (
                      <div className="w-full py-2 text-yellow-500 text-sm flex items-center justify-center">
                        Access Requested <span className="ml-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRequestAccess(product)}
                        className="w-full py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium flex items-center justify-center transition duration-150"
                      >
                        Request Access <span className="ml-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </span>
                      </button>
                    )
                  ) : (
                    <div className="w-full py-2 text-gray-500 text-sm flex items-center justify-center">
                      You don't have access <span className="ml-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                    </div>
                  )}
                  <button className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition duration-150">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-4 px-6 text-xs text-gray-500 border-t border-gray-200 mt-auto">
        <div className="container mx-auto">
          Copyright © 2025, by linkendin.io
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;