import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  CheckCircle, 
  XCircle,
  Box as ProductIcon,
  X,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import logo from '../assets/vertx.png';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    version: ''
  });
  
  // Filter states
  const [versionFilter, setVersionFilter] = useState('All Versions');
  const [searchQuery, setSearchQuery] = useState('');

  // Products data
  const [products, setProducts] = useState([]);
  const [availableVersions, setAvailableVersions] = useState(['All Versions']);
  
  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);


  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  // Fetch products from API
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("vertx");
    if (!tokenFromStorage) {
      navigate('/login');
      return;
    }

    const parsedToken = JSON.parse(tokenFromStorage); // Assuming token is a JSON string
    setToken(parsedToken.token); // Set token to state
  }, [navigate]);

  // Verify token before making API requests
  const verifyToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log('Token verification failed');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      navigate('/login');
    }
  };

  // Fetch products from API
  const getProducts = async () => {
    try {
      // Ensure token is valid before making API call
      await verifyToken();

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

      // Set the products from the API response to state
      setProducts(data.products);

      // Extract unique versions from the products and set them to availableVersions
      const versions = ['All Versions', ...new Set(data.products.map(product => product.version))];
      setAvailableVersions(versions);

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Effect to fetch products on component mount
  useEffect(() => {
    if (token) {
      getProducts();
    }
  }, [token]);

  // Apply filters when filter values change
  useEffect(() => {
    let result = [...products];

    // Apply version filter
    if (versionFilter !== 'All Versions') {
      result = result.filter(product => product.version === versionFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) 
      );
    }

    setFilteredProducts(result);
  }, [products, versionFilter, searchQuery]);

  // Reset filters
  const resetFilters = () => {
    setVersionFilter('All Versions');
    setSearchQuery('');
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      version: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    
    setFormData({
      name: product.name,         // Ensure you're setting the name of the product
      description: product.description,
      url: product.url,
      version: product.version
    });
  
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async () => {
    const newProduct = {
      product_name : formData.name,
      description: formData.description,
      url: formData.url,
      version: formData.version,
    };

   
    try {
      // Ensure token is valid before making API call
      await verifyToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      console.log('Product added successfully:', data);
      getProducts();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    // Ensure token is valid before making API call
    await verifyToken();
  
    const updatedProduct = {
      product_name: formData.name,
      description: formData.description,
      url: formData.url,
      version: formData.version,
    };
  
    try {
      console.log(updatedProduct)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/update/${selectedProduct.id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Product updated successfully:', responseData);
  
        // Update products in state with new data
        const updatedProducts = products.map((product) => {
          if (product.id === selectedProduct.id) {
            return { ...product, ...updatedProduct }; // Use updated data here
          }
          return product;
        });
  
        getProducts()
        setProducts(updatedProducts);
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to update product:', response.status);
      }
    } catch (error) {
      console.error('Error updating product:', error);
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
              <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
              <button 
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add New Product
              </button>
            </div>
            
            {/* Filter Section */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ProductIcon size={20} className="text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium">All Products</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <select 
                      className="w-full p-2 border rounded-md text-sm"
                      value={versionFilter}
                      onChange={(e) => setVersionFilter(e.target.value)}
                    >
                      {availableVersions.map((version) => (
                        <option key={version} value={version}>{version}</option>
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
                placeholder="Search products by name or description"
                className="w-full p-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {product.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.description.length > 70
                                ? product.description.substring(0, 70) + "..."
                                : product.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                {product.url.replace(/^https?:\/\//, '').replace(/\.com|\.io|\.org|\.net$/, '')}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.version}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No products found matching the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter product description"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="text"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter product URL"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      name="version"
                      value={formData.version}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g., v1.0.0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="text"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      name="version"
                      value={formData.version}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;