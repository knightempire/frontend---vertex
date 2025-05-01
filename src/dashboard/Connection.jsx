import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FaUserPlus } from 'react-icons/fa';

const ConnectionsPage = () => {
  const [peopleYouMightKnow, setPeopleYouMightKnow] = useState([]);  // Store the people data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // To capture and display any errors

  // Fetch people data from the API
  const fetchPeople = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/people`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Response not ok:', response.status, response.statusText);
        throw new Error('Failed to fetch people data');
      }

      const peopleData = await response.json();
      console.log('✅ People Data:', peopleData);

      // Check if the response contains the 'users' array
      if (peopleData?.users && Array.isArray(peopleData.users)) {
        setPeopleYouMightKnow(peopleData.users);  // Set the users data
      } else {
        setError('No users found');  // Handle case when users array is empty or undefined
      }
    } catch (error) {
      console.error('Error fetching people data:', error);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);  // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchPeople();  // Fetch people data when the component is mounted
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message until data is fetched
  }

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex justify-center items-start p-6 mt-6">
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Check if peopleYouMightKnow has data */}
          {peopleYouMightKnow.length === 0 ? (
            <div>No connections found</div>  // Display this if no users found
          ) : (
            peopleYouMightKnow.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                {/* Display profile picture or user's initial */}
                <div className="bg-blue-500 text-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()  // Display first letter of the name
                    )}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800">{user.name}</h4>
                <p className="text-gray-600">{user.jobTitle}</p>
                <p className="text-gray-500 text-sm">{user.location}</p>

                <button className="mt-4 flex items-center space-x-2 py-2 px-4 rounded-full text-sm font-semibold border border-[#0073b1] text-[#0073b1] hover:bg-[#0073b1] hover:text-white transition duration-300">
                  <FaUserPlus size={18} />
                  <span>Connect</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
