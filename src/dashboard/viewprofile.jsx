import React, { useState,useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaEdit } from 'react-icons/fa';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewProfile = () => {
    const navigate = useNavigate();
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
      '2025-04-01', '2025-04-02', '2025-04-03', 
      '2025-04-05', '2025-04-06', '2025-04-07',
      '2025-04-10', '2025-04-12', '2025-04-13',
    ], // Mock login dates
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const weeklyDataInSeconds = [500, 300, 1000, 1500, 1200, 1800, 2000]; // Times in seconds (for Monday to Sunday)
  
    const weeklyDataInMinutes = weeklyDataInSeconds.map((time) => Math.floor(time / 60));
    const averageTimeSpent = Math.floor(weeklyDataInMinutes.reduce((a, b) => a + b, 0) / weeklyDataInMinutes.length);


    // Chart.js configuration for the bar chart
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Time Spent (minutes)',
          data: weeklyDataInMinutes,
          backgroundColor: 'skyblue',
          borderRadius: 5,
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw + ' mins'; // Show in minutes
            },
          },
        },
      },
    };


    useEffect(() => {
      const getProfile = async () => {
        const storedData = localStorage.getItem('linkendin');
        const parsed = storedData && JSON.parse(storedData);
        const token = parsed?.token;
        console.log('Token:', token);
        if (!token) return;
  
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Token verification failed');
          }
  
          const result = await response.json();
          console.log('✅ Token verified:', result);
         
        } catch (error) {
          console.error('❌ Token verification error:', error);
        }
      };
  
      getProfile();

  }, []);


  const getMonthName = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getCalendarDates = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const numDaysInMonth = endOfMonth.getDate();
    const startDayOfWeek = (startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1);
    const calendarDates = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDates.push(null);
    }

    for (let i = 2; i <= numDaysInMonth; i++) {
      const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
      calendarDates.push(day);
    }

    const totalSlots = 42;
    const remainingDays = totalSlots - calendarDates.length;
    for (let i = 0; i < remainingDays; i++) {
      calendarDates.push(null);
    }

    return calendarDates.slice(0, totalSlots);
  };

  const maxConsecutiveDays = 5;

  // Mock monthly score data
  const monthlyScores = [
    { month: 'January', score: 60 },
    { month: 'February', score: 80 },
    { month: 'March', score: 55 },
    { month: 'April', score: 70 },
    { month: 'May', score: 90 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex justify-center items-start p-6 mt-6">
        <div className="w-full max-w-6xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Left Section */}
          <div className="w-full md:w-2/3 space-y-8">
            {/* Profile Picture and Cover Photo */}
            <div className="bg-white p-6 rounded-xl shadow-md">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
    {/* Profile Info Section */}
    <div className="flex sm:flex-row sm:space-x-4 items-center justify-center sm:justify-start">
      <img
        src={profileData.profilePicture || 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-2 border-[#0073b1] mb-4 sm:mb-0"
      />
      <div>
        <h2 className="text-2xl font-semibold text-[#0073b1]">{profileData.name}</h2>
        <p className="text-lg text-gray-600">{profileData.jobTitle}</p>
      </div>
    </div>

    {/* Edit Button */}
    <button 
  className="text-[#0073b1] flex items-center space-x-2 mt-4 sm:mt-0" 
  onClick={() => navigate('/editprofile')}
>
  <FaEdit />
  <span>Edit Profile</span>
</button>

  </div>
</div>


            {/* Bio */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">About</h3>
              <p className="text-gray-600">{profileData.bio}</p>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Skills</h3>
              <div className="flex flex-wrap space-x-4">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="bg-[#f3f4f6] text-gray-600 px-4 py-2 rounded-full text-sm">
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

          {/* Right Section - Login Streak and Score */}
          <div className="w-full md:w-1/3">
            {/* Login Streak */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Login Streak</h3>
              <p className="text-gray-600 mb-4">Max Consecutive Login Days: <span className="font-semibold text-[#0073b1]">{maxConsecutiveDays}</span></p>

              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousMonth} className="text-gray-600 hover:text-[#0073b1]">
                  <FaArrowLeft />
                </button>
                <h4 className="text-lg font-semibold text-[#0073b1]">{getMonthName(currentDate)}</h4>
                <button onClick={goToNextMonth} className="text-gray-600 hover:text-[#0073b1]">
                  <FaArrowRight />
                </button>
              </div>

              {/* Calendar View */}
              <div className="grid grid-cols-7 gap-x-1 gap-y-2 mt-4">
                {getCalendarDates().map((date, index) => {
                  if (!date) {
                    return <div key={index} className="w-8 h-8"></div>;
                  }
                  const isLoggedIn = profileData.loginDates.includes(date);
                  const currentDateObj = new Date(date);
                  const isCurrentMonth = currentDateObj.getMonth() === currentDate.getMonth() && currentDateObj.getFullYear() === currentDate.getFullYear();

                  return (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-lg transition-all duration-200 ${isLoggedIn && isCurrentMonth ? 'bg-green-500' : 'bg-gray-300'} 
                      ${isLoggedIn && isCurrentMonth ? 'hover:bg-green-600' : 'hover:bg-gray-400'} cursor-pointer flex justify-center items-center`}
                    >
                      <span className={`text-xs font-medium ${isLoggedIn && isCurrentMonth ? 'text-white' : 'text-gray-700'}`}>
                        {currentDateObj.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-4">Days marked in green represent the days you logged in. Keep the streak going!</p>
            </div>

            {/* Score */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Score: 50</h3>
              <div className="text-gray-600 text-sm mb-4">Monthly Score Overview:</div>
              <div className="space-y-2">
                {monthlyScores.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-[#0073b1]">{data.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-300 rounded-sm">
                        <div
                          className={`h-full bg-[#0073b1] rounded-sm`}
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{data.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Weekly Time Spent</h3>
              <p className="text-sm text-gray-600 mb-4">Average Time Spent: <span className="font-semibold text-[#0073b1]">{averageTimeSpent} mins</span></p>
              <Bar data={data} options={options} />
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
