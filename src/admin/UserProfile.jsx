import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Phone,
  Send,
  MapPin,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import logo from '../assets/linkendin.png';

const UserProfile = () => {
  const { profileId } = useParams(); // Get profileId from URL params
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
    const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // To hold fetched profile data
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To handle errors

  // Log the profileId from URL to the console
  console.log('Extracted profileId from URL:', profileId);

  // Navigate back to the user list
  const onBack = () => {
    navigate('/admin/users'); // Redirects to the /users page
  };

  // Fetch profile data when component mounts or profileId changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {

        console.log('Fetching profile for profileId:', profileId); // Check if profileId is correctly passed

        setLoading(true);
        setError(null);
        const storedData = localStorage.getItem('linkendin');
        const parsed = storedData && JSON.parse(storedData);
        const token = parsed?.token;
        if (token) {
          setToken(token);
        } else {
          navigate('/login');
        }

        if (!token) {
          console.log('No token found, redirecting to login');
          // navigate('/login');
          return;
        }

        if (!profileId) {
          console.log('Profile ID is missing');
          setError('Profile ID is missing');
          setLoading(false);
          return;
        }

        const url = `${import.meta.env.VITE_API_URL}/admin/profile/${profileId}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) {
          throw new Error('Profile not found or server error');
        }

        const profileData = await response.json();
        console.log('Fetched profile data:', profileData);

        if (!profileData || Object.keys(profileData).length === 0) {
          console.log('Profile data is empty or missing');
          setError('Profile data is missing or empty');
        } else {
          setUser(profileData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    } else {
      console.log('No profileId provided');
      setError('Profile ID is missing');
      setLoading(false);
    }
  }, [profileId, navigate]);

  if (loading) {
    return <p>Loading profile...</p>; // Show loading message
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Show error message if any
  }

  if (!user) {
    return <p>No user found.</p>; // Show message if no user data found
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} logo={logo} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content with Scrolling */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 bg-gray-50 min-h-full">
            <div className="flex items-center mb-6">
              <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
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
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>


                  <div className="flex items-center">
                    <Send className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Joined</div>
                      <div className="font-medium">{user.createdAt}</div>
                    </div>
                  </div>

    


                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">phone</div>
                      <div className="font-medium">{user.phone}</div>
                    </div>
                  </div>


                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="font-medium">{user.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>

              {/* Experience and Education Column */}
              <div className="col-span-2 space-y-6">

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
  <h3 className="text-lg font-medium text-gray-800 mb-4">Bio</h3>
  {user.bio ? (
    <p className="text-sm text-gray-700 mb-6">{user.bio}</p>
  ) : (
    <p className="text-gray-500 mb-6">No bio added yet.</p>
  )}

  <h3 className="text-lg font-medium text-gray-800 mb-4">Skills</h3>
  {user.skills && user.skills.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {user.skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No skills listed.</p>
  )}
</div>



                {/* Experience Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Experience</h3>
                  {user.experience.length === 0 && <p className="text-gray-500">No experience added yet.</p>}
                  <ul className="space-y-4">
                    {user.experience.map((exp, index) => (
                      <li key={index} className="border-b border-gray-200 pb-4">
                        <div className="text-md font-semibold text-gray-900">{exp.jobTitle} - {exp.company}</div>
                        <div className="text-sm text-gray-500 mb-1">
                          {exp.startDate} to {exp.endDate}
                        </div>
                        <div className="text-sm text-gray-700">{exp.description}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Education</h3>
                  {user.education.length === 0 && <p className="text-gray-500">No education records added yet.</p>}
                  <ul className="space-y-4">
                    {user.education.map((edu, index) => (
                      <li key={index} className="border-b border-gray-200 pb-4">
                        <div className="text-md font-semibold text-gray-900">{edu.degree}</div>
                        <div className="text-sm text-gray-500">{edu.institution} - {edu.year}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
