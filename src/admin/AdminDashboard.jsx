import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Filter, 
  ChevronDown,
  TrendingUp,
  MessageSquare,
  CreditCard,
  Layers
} from 'lucide-react';
import logo from '../assets/vertx.png';

// Import our new components
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
  
  // Filter state
  const [filters, setFilters] = useState({
    timePeriod: 'last30days',
    product: 'all',
    subscriptionType: 'all'
  });
  
  // Original mock data - removed revenue-related stats
  const originalStats = [
    { title: 'Active Users', value: '12,849', change: '+7.4%', icon: <Users size={20} /> },
    { title: 'Subscriptions', value: '8,392', change: '+12.1%', icon: <CreditCard size={20} /> },
    { title: 'Avg. Engagement', value: '48.2m', change: '+5.3%', icon: <TrendingUp size={20} /> },
    { title: 'Support Tickets', value: '156', change: '-2.8%', icon: <MessageSquare size={20} /> },
  ];
  
  const originalProducts = [
    { id: 1, name: 'AutoDCA', subscribers: 1842, growth: '+12%', status: 'Active' },
    { id: 2, name: 'AutoMBAL', subscribers: 1293, growth: '+8%', status: 'Active' },
    { id: 3, name: 'Prodn. Modeling', subscribers: 976, growth: '+5%', status: 'Active' },
    { id: 4, name: 'fAIcies Interpretation', subscribers: 2104, growth: '+15%', status: 'Active' },
    { id: 5, name: 'Geomechanix', subscribers: 1587, growth: '+9%', status: 'Active' },
  ];
  
  const originalSubscriptions = [
    { id: 1, company: 'TechCorp Inc.', product: 'AutoDCA + AutoMBAL', plan: 'Enterprise', date: 'Today' },
    { id: 2, company: 'Global Systems', product: 'fAIcies Interpretation', plan: 'Team', date: 'Yesterday' },
    { id: 3, company: 'InnoSoft Solutions', product: 'Prodn. Modeling', plan: 'Business', date: '2 days ago' },
    { id: 4, company: 'DataViz Corp', product: 'AutoDCA', plan: 'Professional', date: '3 days ago' },
  ];
  
  const originalSupportRequests = [
    { id: 1, issue: 'API Integration Issue', product: 'AutoMBAL', priority: 'High', status: 'Open' },
    { id: 2, issue: 'Dashboard Not Loading', product: 'AutoDCA', priority: 'Medium', status: 'In Progress' },
    { id: 3, issue: 'Billing Discrepancy', product: 'Geomechanix', priority: 'High', status: 'Open' },
    { id: 4, issue: 'Feature Request', product: 'fAIcies Interpretation', priority: 'Low', status: 'Under Review' },
  ];

  // Filtered data states
  const [stats, setStats] = useState(originalStats);
  const [products, setProducts] = useState(originalProducts);
  const [recentSubscriptions, setRecentSubscriptions] = useState(originalSubscriptions);
  const [supportRequests, setSupportRequests] = useState(originalSupportRequests);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Automatically apply filters whenever a filter value changes
    applyFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters function
  const applyFilters = (updatedFilters) => {
    const currentFilters = updatedFilters || filters;

    // Filter products based on selected product
    let filteredProducts = [...originalProducts];
    if (currentFilters.product !== 'all') {
      filteredProducts = originalProducts.filter(
        (prod) => prod.name === currentFilters.product
      );
    }
    setProducts(filteredProducts);

    // Filter subscriptions based on product and subscription type
    let filteredSubscriptions = [...originalSubscriptions];
    if (currentFilters.product !== 'all') {
      filteredSubscriptions = filteredSubscriptions.filter((sub) =>
        sub.product.includes(currentFilters.product)
      );
    }
    if (currentFilters.subscriptionType !== 'all') {
      filteredSubscriptions = filteredSubscriptions.filter(
        (sub) => sub.plan === currentFilters.subscriptionType
      );
    }
    setRecentSubscriptions(filteredSubscriptions);

    // Filter support requests based on product
    let filteredRequests = [...originalSupportRequests];
    if (currentFilters.product !== 'all') {
      filteredRequests = filteredRequests.filter(
        (req) => req.product === currentFilters.product
      );
    }
    setSupportRequests(filteredRequests);

    // Simulate stats changes based on time period
    let statMultiplier = 1;
    switch (currentFilters.timePeriod) {
      case 'last90days':
        statMultiplier = 2.5;
        break;
      case 'last6months':
        statMultiplier = 5.2;
        break;
      case 'lastyear':
        statMultiplier = 9.7;
        break;
      case 'alltime':
        statMultiplier = 15.3;
        break;
      default:
        statMultiplier = 1;
    }

    // Update stats with the multiplier
    const updatedStats = originalStats.map((stat) => {
      if (stat.title === 'Support Tickets') {
        const numericValue = parseFloat(stat.value.replace(/[^0-9.-]+/g, ""));
        return {
          ...stat,
          value: `${Math.round(
            numericValue * (statMultiplier > 1 ? Math.sqrt(statMultiplier) : 1)
          ).toLocaleString()}`,
        };
      } else {
        const numericValue = parseFloat(stat.value.replace(/[^0-9.-]+/g, ""));
        const formattedValue = stat.value.endsWith('m')
          ? `${(numericValue * statMultiplier).toFixed(1)}m`
          : `${Math.round(numericValue * statMultiplier).toLocaleString()}`;
        return {
          ...stat,
          value: formattedValue,
        };
      }
    });

    setStats(updatedStats);
  };

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      timePeriod: 'last30days',
      product: 'all',
      subscriptionType: 'all'
    });
    setProducts(originalProducts);
    setRecentSubscriptions(originalSubscriptions);
    setSupportRequests(originalSupportRequests);
    setStats(originalStats);
  };

  // Apply initial filters on component mount
  useEffect(() => {
    applyFilters();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        logo={logo} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar Component */}
        <Navbar />
        
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Filter Section */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Dashboard Overview</h2>
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
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                  <select 
                    name="timePeriod"
                    value={filters.timePeriod}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="last30days">Last 30 days</option>
                    <option value="last90days">Last 90 days</option>
                    <option value="last6months">Last 6 months</option>
                    <option value="lastyear">Last year</option>
                    <option value="alltime">All time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select 
                    name="product"
                    value={filters.product}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="all">All Products</option>
                    <option value="AutoDCA">AutoDCA</option>
                    <option value="AutoMBAL">AutoMBAL</option>
                    <option value="Prodn. Modeling">Prodn. Modeling</option>
                    <option value="fAIcies Interpretation">fAIcies Interpretation</option>
                    <option value="Geomechanix">Geomechanix</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Type</label>
                  <select 
                    name="subscriptionType"
                    value={filters.subscriptionType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="Free">Free</option>
                    <option value="Professional">Professional</option>
                    <option value="Team">Team</option>
                    <option value="Business">Business</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <div className="p-2 text-indigo-600 bg-indigo-100 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <span className={`ml-2 text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-medium">Product Performance</h2>
              <Link to="/admin/products" className="text-sm text-indigo-600 hover:underline">Manage Products</Link>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center mr-3">
                              <Layers className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.subscribers.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">{product.growth}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            product.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Subscriptions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-medium">Recent Subscriptions</h2>
                <Link to="/admin/subscriptions" className="text-sm text-indigo-600 hover:underline">View all</Link>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{sub.company}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{sub.product}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                              {sub.plan}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{sub.date}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Support Requests */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-medium">Support Requests</h2>
                <Link to="/admin/support" className="text-sm text-indigo-600 hover:underline">View all</Link>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {supportRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{request.issue}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.product}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                              request.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status}
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
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;