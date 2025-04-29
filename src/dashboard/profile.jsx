import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaCamera, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';  // Added FaTimes for close icon
import Navbar from './Navbar'; // Assuming you have a Navbar component

const ProfileManagement = ({ onSearch }) => {
  // State to manage form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // State for skills as tags
  const [skillTags, setSkillTags] = useState([]);

  // Education and Experience States (Arrays to handle multiple entries)
  const [educationList, setEducationList] = useState([{ degree: '', institution: '', year: '' }]);
  const [experienceList, setExperienceList] = useState([{ jobTitle: '', company: '', startDate: '', endDate: '' }]);

  // Simulate fetching initial data
  useEffect(() => {
    const getProfile = async () => {
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
      const email = parsed?.email || 'john.doe@example.com'; // get from storage or fallback
    
      console.log('Token:', token);
      if (!token) return;
    
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email }), // 💡 Send email in body
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
    
        const result = await response.json();
        console.log('✅ Profile data:', result);
    
        const profile = result.profile;
    
        // 🧠 Set state with returned profile data
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
        setBio(profile.bio);
        setJobTitle(profile.jobTitle);
        setLocation(profile.location);
        setSkillTags(profile.skills || []);
        setEducationList(profile.education || []);
        setExperienceList(profile.experience || []);
        setProfilePicture(profile.profilePicture);
    
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
      }
    };
    getProfile();
  }, []);

  // Handle form submission
  const handleSave = async () => {
    if (!name || !email || !phone || !bio || !jobTitle || !location || skillTags.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'All fields must be filled out!',
        icon: 'error',
        confirmButtonColor: '#0073b1',
      });
      return;
    }
  
    const profileData = {
      name,
      email, // This should come from localStorage or token context ideally
      phone,
      bio,
      jobTitle,
      location,
      skills: skillTags,
      education: educationList,
      experience: experienceList,
    };
  
    console.log('📝 Submitted Profile Data:', profileData);
  
    try {
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // if your backend is using JWT
        },
        body: JSON.stringify(profileData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text: result.message || 'Your profile has been updated!',
          icon: 'success',
          confirmButtonColor: '#0073b1',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: result.message || 'Failed to update profile.',
          icon: 'error',
          confirmButtonColor: '#0073b1',
        });
      }
  
    } catch (error) {
      console.error('❌ Profile update error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonColor: '#0073b1',
      });
    }
  };
  
  

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  // Functions to handle adding and removing education entries
  const addEducation = () => {
    setEducationList([...educationList, { degree: '', institution: '', year: '' }]);
  };

  const removeEducation = (index) => {
    const newEducationList = educationList.filter((_, i) => i !== index);
    setEducationList(newEducationList);
  };

  // Functions to handle adding and removing experience entries
  const addExperience = () => {
    setExperienceList([...experienceList, { jobTitle: '', company: '', startDate: '', endDate: '' }]);
  };

  const removeExperience = (index) => {
    const newExperienceList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newExperienceList);
  };

  // Function to handle adding skill tags
  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skills.trim() !== '') {
      setSkillTags([...skillTags, skills]);
      setSkills('');
    }
  };

  // Function to handle removing a skill tag
  const removeSkill = (index) => {
    const newSkillTags = skillTags.filter((_, i) => i !== index);
    setSkillTags(newSkillTags);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar onSearch={(term) => onSearch(term)} />

      <div className="flex justify-center items-start p-6 mt-6">
        <div className="w-full max-w-4xl space-y-8">
          {/* Profile Picture Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#0073b1] mb-6 text-center">Edit Profile</h2>
            <div className="flex justify-center mb-6">
              <div className="relative">
              {profilePicture ? (
  <img
    src={profilePicture}
    alt="Profile"
    className="w-32 h-32 rounded-full object-cover border-2 border-[#0073b1]"
  />
) : (
  <div className="bg-blue-500 text-white rounded-full h-32 w-32 flex items-center justify-center text-4xl font-semibold">
    {name ? name.charAt(0).toUpperCase() : 'N'}
  </div>
)}

                <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-[#0073b1] text-white p-2 rounded-full cursor-pointer">
                  <FaCamera />
                  <input
                    type="file"
                    id="profilePicture"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-gray-600 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm text-gray-600 font-medium mb-1">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1] h-32"
                />
              </div>
            </div>
          </div>

          {/* Job Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Job Information</h3>
            {experienceList.map((experience, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`jobTitle-${index}`} className="block text-sm text-gray-600 font-medium mb-1">Job Title</label>
                    <input
                      type="text"
                      id={`jobTitle-${index}`}
                      value={experience.jobTitle}
                      onChange={(e) => {
                        const newExperienceList = [...experienceList];
                        newExperienceList[index].jobTitle = e.target.value;
                        setExperienceList(newExperienceList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>

                  <div>
                    <label htmlFor={`company-${index}`} className="block text-sm text-gray-600 font-medium mb-1">Company</label>
                    <input
                      type="text"
                      id={`company-${index}`}
                      value={experience.company}
                      onChange={(e) => {
                        const newExperienceList = [...experienceList];
                        newExperienceList[index].company = e.target.value;
                        setExperienceList(newExperienceList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>

                  <div>
                    <label htmlFor={`startDate-${index}`} className="block text-sm text-gray-600 font-medium mb-1">Start Date</label>
                    <input
                      type="month"
                      id={`startDate-${index}`}
                      value={experience.startDate}
                      onChange={(e) => {
                        const newExperienceList = [...experienceList];
                        newExperienceList[index].startDate = e.target.value;
                        setExperienceList(newExperienceList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>

                  <div>
                    <label htmlFor={`endDate-${index}`} className="block text-sm text-gray-600 font-medium mb-1">End Date</label>
                    <input
                      type="month"
                      id={`endDate-${index}`}
                      value={experience.endDate}
                      onChange={(e) => {
                        const newExperienceList = [...experienceList];
                        newExperienceList[index].endDate = e.target.value;
                        setExperienceList(newExperienceList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 flex items-center space-x-2 mt-2"
                >
                  <FaMinus /> <span>Remove Experience</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="text-[#0073b1] flex items-center space-x-2 mt-4"
            >
              <FaPlus /> <span>Add Another Job</span>
            </button>
          </div>

          {/* Education Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Education</h3>
            {educationList.map((education, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`degree-${index}`} className="block text-sm text-gray-600 font-medium mb-1">Degree</label>
                    <input
                      type="text"
                      id={`degree-${index}`}
                      value={education.degree}
                      onChange={(e) => {
                        const newEducationList = [...educationList];
                        newEducationList[index].degree = e.target.value;
                        setEducationList(newEducationList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>

                  <div>
                    <label htmlFor={`institution-${index}`} className="block text-sm text-gray-600 font-medium mb-1">Institution</label>
                    <input
                      type="text"
                      id={`institution-${index}`}
                      value={education.institution}
                      onChange={(e) => {
                        const newEducationList = [...educationList];
                        newEducationList[index].institution = e.target.value;
                        setEducationList(newEducationList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>

                  <div>
                    <label htmlFor={`year-${index}`} className="block text-sm text-gray-600 font-medium mb-1">Year</label>
                    <input
                      type="text"
                      id={`year-${index}`}
                      value={education.year}
                      onChange={(e) => {
                        const newEducationList = [...educationList];
                        newEducationList[index].year = e.target.value;
                        setEducationList(newEducationList);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 flex items-center space-x-2 mt-2"
                >
                  <FaMinus /> <span>Remove Education</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="text-[#0073b1] flex items-center space-x-2 mt-4"
            >
              <FaPlus /> <span>Add Another Education</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-6">Skills</h3>
            <div>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                onKeyDown={handleSkillAdd}
                placeholder="Press Enter to add skill"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0073b1] focus:border-[#0073b1]"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillTags.map((skill, index) => (
                <div key={index} className="flex items-center bg-[#0073b1] text-white px-4 py-1 rounded-full">
                  <span>{skill}</span>
                  <FaTimes
                    onClick={() => removeSkill(index)}
                    className="ml-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>



          {/* Save Changes */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#0073b1] text-white rounded-full hover:bg-[#005682] text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
