import React from 'react';
import Navbar from './Navbar'; 
import { FaUserPlus } from 'react-icons/fa'; 

const ConnectionsPage = () => {

  const connectionsData = [
    {
      id: 1,
      name: 'John Doe',
      jobTitle: 'Full Stack Developer',
      location: 'San Francisco, CA',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Jane Smith',
      jobTitle: 'Frontend Developer',
      location: 'New York, NY',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Samuel Green',
      jobTitle: 'Backend Developer',
      location: 'Los Angeles, CA',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: 'Emily Johnson',
      jobTitle: 'UI/UX Designer',
      location: 'Austin, TX',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      name: 'Michael Brown',
      jobTitle: 'DevOps Engineer',
      location: 'Chicago, IL',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 6,
      name: 'Sophia Martinez',
      jobTitle: 'Product Manager',
      location: 'Seattle, WA',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 7,
      name: 'David Lee',
      jobTitle: 'Data Scientist',
      location: 'Boston, MA',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 8,
      name: 'Olivia King',
      jobTitle: 'Software Engineer',
      location: 'Miami, FL',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 9,
      name: 'William Harris',
      jobTitle: 'Marketing Specialist',
      location: 'Dallas, TX',
      profilePicture: 'https://via.placeholder.com/150',
    },
    {
      id: 10,
      name: 'Isabella Wilson',
      jobTitle: 'QA Engineer',
      location: 'Denver, CO',
      profilePicture: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex justify-center items-start p-6 mt-6">
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Iterate through the connections data and display each user as a card */}
          {connectionsData.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#0073b1]"
              />
              <h4 className="text-lg font-semibold text-gray-800">{user.name}</h4>
              <p className="text-gray-600">{user.jobTitle}</p>
              <p className="text-gray-500 text-sm">{user.location}</p>
              

              <button className="mt-4 flex items-center space-x-2 py-2 px-4 rounded-full text-sm font-semibold border border-[#0073b1] text-[#0073b1] hover:bg-[#0073b1] hover:text-white transition duration-300">
                <FaUserPlus size={18} />
                <span>Connect</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
