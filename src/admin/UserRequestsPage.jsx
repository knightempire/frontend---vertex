import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  CheckCircle, 
  XCircle,
  Clock,
  User ,
  Package,
  Calendar,
  Info,
  Check,
  X,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import logo from '../assets/linkendin.png';
import { useNavigate } from 'react-router-dom';

const UserRequestsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [productFilter, setProductFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [token, setToken] = useState(null); // State for token
  const navigate = useNavigate();

  // Fetch user requests from API
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("linkendin");
    console.log("Token from localStorage:", tokenFromStorage);

    if (!tokenFromStorage) {
      navigate('/login');
      return;
    }

    const parsedToken = JSON.parse(tokenFromStorage);
    setToken(parsedToken.token); // Set token in state
    console.log("Extracted token:", parsedToken.token);

    // Verify the token
    verifyToken(parsedToken.token);
  }, [navigate]);
    // Function to verify the token
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
          getUserRequest(token);
          getProducts(token);
        } else {
          console.log('Token verification failed:', response);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/login');
      }
    };

  // Apply filters when filter values change
  useEffect(() => {
    let result = [...requests];

    // Apply filters
    if (statusFilter !== 'All Statuses') {
      result = result.filter(request => request.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (productFilter !== 'All Products') {
      result = result.filter(request => request.productName.toLowerCase() === productFilter.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(request => 
        request.userName.toLowerCase().includes(query) || 
        request.userEmail.toLowerCase().includes(query)
      );
    }

    // Update filteredRequests with the sliced data for the current page
    setFilteredRequests(result);
  }, [requests, statusFilter, productFilter, searchQuery]);

  // Pagination logic to show only the items for the current page
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setStatusFilter('All Statuses');
    setProductFilter('All Products');
    setSearchQuery('');
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
    setCommentText('');
  };

  const getUserRequest = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/product/reqlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log(data);

      // Helper function to capitalize the first letter and make the rest lowercase
      const capitalizeFirstLetter = (str) => {
        if (!str) return str; // Handle if the string is empty or null
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      const formattedRequests = data.requests.flatMap(req =>
        req.requests.map(r => ({
          id: req.requestId,
          userId: req.requestId,
          userName: capitalizeFirstLetter(req.name), 
          userEmail: req.username,
          company: "", 
          productId: req.product_name, 
          productName: capitalizeFirstLetter(req.product_name), 
          requestDate: r.requestDate,
          status: r.status,
          justification: "Justification not provided",
          approvedDate: r.approvedDate || null, 
          timesRequested: req.requests.length,
          comments: req.requests
            .filter(request => request.comment !== null) 
            .map(request => ({
              text: request.comment,  
              date: request.approvedDate || null 
            })),
        }))
      );

      // Log the formattedRequests to the console
      console.log(formattedRequests);

      // Sort requests by requestDate (most recent first)
      const sortedRequests = formattedRequests.sort((a, b) => {
        const dateA = new Date(a.requestDate);
        const dateB = new Date(b.requestDate);
        return dateB - dateA; // Descending order (most recent first)
      });

      // Set the sorted requests to state
      setRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };

  const getProducts = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/display`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log(data);  // Log the response to inspect

      // Assuming the response has a "products" array, extract id and name from each product
      const productList = data.products.map(product => ({
        id: product.id,
        name: product.name,
      }));

      // Update the state with the product list
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };

  const handleApproveRequest = async () => {
    if (!token) {
      console.error('No token available for approval request');
      return;
    }

    console.log("Request Approved ID:", selectedRequest.id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/product/update/${selectedRequest.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 1, // status 1 for approval
          comment: commentText || null, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error('Failed to approve the request');
      }

      const data = await response.json();
      console.log('Request approved successfully:', data);
      getUserRequest(token); // Refresh requests
      setIsDetailsModalOpen(false);
    } catch (error) {
      console.error('Error in approving request:', error);
    }
  };
  
  const handleRejectRequest = async () => {
    if (!token) {
      console.error('No token available for rejection request');
      return;
    }
  
    console.log("Request Rejected ID:", selectedRequest.id);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/product/update/${selectedRequest.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 0, // status 0 for rejection
          comment: commentText || null, 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error('Failed to reject the request');
      }
  
      const data = await response.json();
      console.log('Request rejected successfully:', data);
      getUserRequest(token); // Pass the token to refresh requests
      setIsDetailsModalOpen(false);
    } catch (error) {
      console.error('Error in rejecting request:', error);
    }
  };
  const getStatusBadgeClasses = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 mr-1" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4 mr-1" />;
    }
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
          <div className="p-6 bg-gray-50 min-h-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">User  Requests</h1>
            </div>
            
            {/* Filter Section */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <User Icon size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium">Product Access Requests</h2>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className="w-full p-2 border rounded-md text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option>All Statuses</option>
                      <option>pending</option>
                      <option>approved</option>
                      <option>rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select 
                      className="w-full p-2 border rounded-md text-sm"
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                    >
                      <option>All Products</option>
                      {products.map(product => (
                        <option key={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button 
                      onClick={resetFilters}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Box */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by user name, email or company"
                className="w-full p-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Requests Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRequests.length > 0 ? (
                      paginatedRequests.map((request) => (
                        <tr key={`${request.id}-${request.requestDate}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {request.userName && request.userName.split(' ').map(n => n[0]).join('') || 'N/A'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                                <div className="text-sm text-gray-500">{request.userEmail}</div>
                                <div className="text-xs text-gray-500">{request.company}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-indigo-500 mr-2" />
                              <div className="text-sm text-gray-900">{request.productName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <div className="text-sm text-gray-900">{request.requestDate}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No requests found matching the current filters.
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
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> of <span className="font-medium">{filteredRequests.length}</span> requests
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.ceil(filteredRequests.length / itemsPerPage) }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1 ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredRequests.length / itemsPerPage)))}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        disabled={currentPage === Math.ceil(filteredRequests.length / itemsPerPage)}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Request Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Request Details</h3>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Request Info */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Request ID</p>
                        <p className="text-sm font-medium">{selectedRequest.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(selectedRequest.status)}`}>
                          {getStatusIcon(selectedRequest.status)}
                          {selectedRequest.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Request Date</p>
                        <p className="text-sm">{selectedRequest.requestDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User Icon size={16} className="mr-1" /> User Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium">{selectedRequest.userName}</p>
                      <p className="text-sm">{selectedRequest.userEmail}</p>
                      <p className="text-sm text-gray-600">{selectedRequest.company}</p>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Package size={16} className="mr-1" /> Product Requested
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium">{selectedRequest.productName}</p>
                    </div>
                  </div>
                  
                  {/* times requested */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Info size={16} className="mr-1" /> No of times requested
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm">{selectedRequest.timesRequested}</p>
                    </div>
                  </div>
                  
                  {/* Comments */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MessageSquare size={16} className="mr-1" /> Comments ({selectedRequest.comments.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedRequest.comments.length > 0 ? (
                        selectedRequest.comments.map(comment => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                              <span>{comment.author}</span>
                              <span>{comment.date}</span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Add Comment */}
                  {selectedRequest.status === 'pending' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment (Optional)</label>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Enter your comment or reason for approval/rejection"
                        rows="3"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={handleRejectRequest}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleApproveRequest}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequestsPage;