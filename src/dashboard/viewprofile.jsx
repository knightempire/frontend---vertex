import React from 'react';
import { FaEdit } from 'react-icons/fa';
import Navbar from './Navbar';  // Assuming you have a Navbar component

const ViewProfile = () => {
  // Mock profile data as const within the component
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    bio: 'Software engineer with a passion for technology and innovation.',
    jobTitle: 'Full Stack Developer',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    experience: [
      {
        jobTitle: 'Software Engineer',
        company: 'Tech Co.',
        startDate: '2016-01',
        endDate: '2020-12',
        description: 'Worked on developing full-stack applications using JavaScript, React, and Node.js.',
      },
      {
        jobTitle: 'Frontend Developer',
        company: 'Design Inc.',
        startDate: '2014-01',
        endDate: '2015-12',
        description: 'Responsible for creating user interfaces using HTML, CSS, and JavaScript.',
      }
    ],
    education: [
      {
        degree: 'B.Sc. Computer Science',
        institution: 'University A',
        year: '2015',
      },
      {
        degree: 'M.Sc. Software Engineering',
        institution: 'University B',
        year: '2017',
      }
    ],
    profilePicture: 'https://via.placeholder.com/150',
    loginDates: [
      '2025-04-01', '2025-04-02', '2025-04-03', // Sample login dates
      '2025-04-05', '2025-04-06', '2025-04-07',
      '2025-04-10', '2025-04-12', '2025-04-13',
    ], // Mock login dates
  };

  // Function to calculate the maximum number of consecutive login days
  const calculateMaxConsecutiveDays = (loginDates) => {
    if (!loginDates || loginDates.length === 0) return 0;

    // Sort the login dates
    const sortedDates = loginDates.map(date => new Date(date)).sort((a, b) => a - b);

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const diff = (currentDate - prevDate) / (1000 * 3600 * 24); // Difference in days

      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
    }

    return maxStreak;
  };

  const maxConsecutiveDays = calculateMaxConsecutiveDays(profileData.loginDates);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex justify-center items-start p-6 mt-6">
        <div className="w-full max-w-6xl flex space-x-8">
          {/* Left Section (2/3) */}
          <div className="w-2/3 space-y-8">
            {/* Profile Picture and Cover Photo */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={profileData.profilePicture || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-[#0073b1]"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0073b1]">{profileData.name}</h2>
                    <p className="text-lg text-gray-600">{profileData.jobTitle}</p>
                  </div>
                </div>
                <button className="text-[#0073b1] flex items-center space-x-2">
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Bio and Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">About</h3>
              <p className="text-gray-600">{profileData.bio}</p>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Skills</h3>
              <div className="flex flex-wrap space-x-4">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#f3f4f6] text-gray-600 px-4 py-2 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Experience</h3>
              {profileData.experience.map((experience, index) => (
                <div key={index} className="space-y-4">
                  <div className="space-y-2 flex justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-gray-800">{experience.jobTitle}</h4>
                      <p className="text-gray-600">{experience.company}</p>
                      <p className="text-gray-600">{experience.description}</p>
                    </div>
                    <div className="text-gray-500 flex flex-col items-end">
                      <p>{experience.startDate} - {experience.endDate}</p>
                    </div>
                  </div>
                  {index !== profileData.experience.length - 1 && (
                    <div className="my-4 border-t-2 border-[#0073b1]"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Education</h3>
              {profileData.education.map((education, index) => (
                <div key={index} className="space-y-4">
                  <div className="space-y-2 flex justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-gray-800">{education.degree}</h4>
                      <p className="text-gray-600">{education.institution}</p>
                    </div>
                    <div className="text-gray-500 flex flex-col items-end">
                      <p>{education.year}</p>
                    </div>
                  </div>
                  {index !== profileData.education.length - 1 && (
                    <div className="my-4 border-t-2 border-[#0073b1]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section (1/3) - Login Streak */}
          <div className="w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Login Streak</h3>
              <p className="text-gray-600 mb-4">Max Consecutive Login Days: <span className="font-semibold text-[#0073b1]">{maxConsecutiveDays}</span></p>

              <div className="grid grid-cols-7 gap-x-1 gap-y-2 mt-4">
                {/* Generate a calendar view of login days */}
                {Array.from({ length: 30 }, (_, i) => {
                  const currentDate = new Date();
                  currentDate.setDate(currentDate.getDate() - i);
                  const dateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                  const isLoggedIn = profileData.loginDates.includes(dateString);

                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg transition-all duration-200 ${isLoggedIn ? 'bg-green-500' : 'bg-gray-300'} 
                      ${isLoggedIn ? 'hover:bg-green-600' : 'hover:bg-gray-400'} cursor-pointer flex justify-center items-center`}
                    >
                      <span className={`text-xs font-medium ${isLoggedIn ? 'text-white' : 'text-gray-700'}`}>
                        {currentDate.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-gray-500 mt-4">Days marked in green represent the days you logged in. Keep the streak going!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
