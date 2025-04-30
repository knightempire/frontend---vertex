import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';
import Navbar from './Navbar';
import { FaThumbsUp, FaShareAlt, FaBookmark } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaFlag } from 'react-icons/fa';


const RedditFeed = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
    const [activityData, setActivityData] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [peopleYouMightKnow, setPeopleYouMightKnow] = useState([]);
  const feedEndRef = useRef(null);
  const [after, setAfter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const primaryColor = "#0073b1";
  const milkyWhite = "#f5f5f7";
  const darkColor = "#333";
  const lightGray = "#dfe3e8";

  // Convert UTC timestamp to Asia timezone (IST) in dd-mm-yyyy hh:mm format using moment
  const formatDate = (timestamp) => {
    return moment.unix(timestamp).utcOffset(330).format('DD-MM-YYYY HH:mm');
  };

  // Fetch posts from Reddit based on the search term
  const fetchPosts = async (manualLoad = false) => {
    if (loading) return; // Prevent multiple concurrent fetches
  
    setLoading(true);
  
    const cacheKey = `posts_${searchTerm || 'all'}_${after || ''}`;
    const cacheData = localStorage.getItem(cacheKey);
  
    // Check if cached data exists and is not expired
    if (cacheData) {
      const parsedData = JSON.parse(cacheData);
      const currentTime = new Date().getTime();
      
      // If the data is older than 1 hour, consider it expired
      if (currentTime - parsedData.timestamp < 3600000) {
        setPosts(parsedData.posts);
        setAfter(parsedData.after);
        setLoading(false);
        return;
      }
    }
  
    // If no valid cache, fetch new data
    const url = after
      ? searchTerm
        ? `https://www.reddit.com/r/all/search.json?q=${searchTerm}&after=${after}&sort=top`
        : `https://www.reddit.com/r/all/top.json?after=${after}`
      : searchTerm
      ? `https://www.reddit.com/r/all/search.json?q=${searchTerm}&sort=top`
      : 'https://www.reddit.com/r/all/top.json';
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (response.ok) {
        const newPosts = data.data.children.map((post) => ({
          id: post.data.id,
          title: post.data.title,
          url: post.data.url,
          author: post.data.author,
          score: post.data.score,
          subreddit: post.data.subreddit,
          thumbnail: post.data.thumbnail,
          is_video: post.data.is_video,
          media: post.data.media,
          num_comments: post.data.num_comments,
          link_flair_text: post.data.link_flair_text,
          created_utc: post.data.created_utc,
        }));
  
        // Filter out duplicates based on post.id
        const filteredPosts = [
          ...posts,
          ...newPosts.filter((newPost) => !posts.some((post) => post.id === newPost.id)),
        ];
  
        setPosts(filteredPosts);
        setAfter(data.data.after);
  
        // Cache the data in localStorage
        const cacheData = {
          posts: filteredPosts,
          after: data.data.after,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Could not fetch Reddit posts. Please try again later.',
          icon: 'error',
          confirmButtonColor: primaryColor,
        });
      }
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while fetching posts.',
        icon: 'error',
        confirmButtonColor: primaryColor,
      });
    } finally {
      if (!manualLoad) {
        setLoading(false); // Only stop loading when not a manual load
      }
    }
  };
  

  // Fetch the top trending posts from Reddit
  const fetchTrendingPosts = async () => {
    const cacheKey = 'trending_posts';
    const cacheData = localStorage.getItem(cacheKey);
  
    // Check if cached data exists and is not expired
    if (cacheData) {
      const parsedData = JSON.parse(cacheData);
      const currentTime = new Date().getTime();
      
      // If the data is older than 1 hour, consider it expired
      if (currentTime - parsedData.timestamp < 3600000) {
        setTrendingPosts(parsedData.trendingPosts);
        return;
      }
    }
  
    // If no valid cache, fetch new data
    try {
      const response = await fetch('https://www.reddit.com/r/all/top.json?limit=5'); // Limit to 5 trending posts
      const data = await response.json();
  
      if (response.ok) {
        const trendingPostsData = data.data.children.map((post) => ({
          title: post.data.title,
          url: post.data.url,
          score: post.data.score,
          author: post.data.author,
          subreddit: post.data.subreddit,
          num_comments: post.data.num_comments,
        }));
  
        trendingPostsData.sort((a, b) => {
          if (b.score === a.score) {
            return b.num_comments - a.num_comments;
          }
          return b.score - a.score;
        });
  
        setTrendingPosts(trendingPostsData);
  

        const cacheData = {
          trendingPosts: trendingPostsData,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Could not fetch trending posts. Please try again later.',
          icon: 'error',
          confirmButtonColor: primaryColor,
        });
      }
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while fetching trending posts.',
        icon: 'error',
        confirmButtonColor: primaryColor,
      });
    }
  };
  


  const handleReport = async (post) => {
    // Define the report types
    const reportTypes = {
      spam: 'Spam',
      harassment: 'Harassment',
      misinformation: 'Misinformation',
      other: 'Other',
    };
  
    // Use Swal to let the user select the reason for reporting
    const { value: reason } = await Swal.fire({
      title: 'Report Post',
      input: 'select',
      inputOptions: reportTypes,  // This will show the report types dynamically
      inputPlaceholder: 'Select a reason',
      showCancelButton: true,
      confirmButtonColor: primaryColor,
      cancelButtonColor: lightGray,
    });
  
    if (reason) {
      Swal.fire({
        title: 'Reported!',
        text: `You reported this post for: ${reportTypes[reason]}`, // Show the selected reason
        icon: 'success',
        confirmButtonColor: primaryColor,
      });
  
      // Assuming user authentication info is stored in localStorage
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
      console.log('Token:', token);
  
      // Make the API call to report the post
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Send the token for authorization
          },
          body: JSON.stringify({
            postId: post.id,  // Send the post ID
            reportType: reason,  // Send the report type selected by the user
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log('Report submitted successfully:', data);
        } else {
          console.error('Error submitting report:', data.message);
        }
      } catch (error) {
        console.error('Error reporting post:', error);
      }
    }
  };
  
  useEffect(() => {
    const verifyToken = async () => {
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
      console.log('Token:', token);
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/verify-token`, {
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
        setUser(result.user); // Store the user data here
      } catch (error) {
        console.error('❌ Token verification error:', error);
      }
    };

    const getProfile = async () => {
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
      console.log('Token:', token);
      if (!token) return;

      try {
        const activityResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/activity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!activityResponse.ok) {
          throw new Error('Failed to fetch activity data');
        }

        const activityResult = await activityResponse.json();
        console.log('✅ Activity Data:', activityResult);

        if (activityResult?.activeTime) {
          console.log('Active Time:', activityResult.activeTime);
          setActivityData({
            loginDates: activityResult.loginDates,
            loginScores: activityResult.loginScores,
            streak: activityResult.streak,
            time: activityResult.activeTime,
          });
        } else {
          setActivityData({ loginDates: [], loginScores: [], time: [], streak: 0 });
        }
      } catch (error) {
        console.error('❌ Error:', error);
      }
    };

    // Fetching people data from GET /user/people API
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
          // Set the users data
          setPeopleYouMightKnow(peopleData.users);
        } else {
          console.error('❌ No valid users data found');
        }
      } catch (error) {
        console.error('❌ Error fetching people data:', error);
      }
    };
    
    
    
    const getRandomPeople = (peopleList, count) => {
      // Shuffle the people list and pick the first 'count' people
      const shuffled = [...peopleList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    
    console.log('ppl',peopleYouMightKnow);


    // Call all the functions on component mount
    verifyToken();
    getProfile();
    fetchPeople(); // Fetch people data here
    fetchPosts();
    fetchTrendingPosts();
  }, [searchTerm]); // This dependency array ensures that useEffect is triggered when searchTerm changes


  const maxConsecutiveDays = activityData?.streak || 0; // Use optional chaining to safely access streak or fallback to 0
  const loginScores = activityData?.loginScores || [];
  const lastLoginScore = loginScores.length > 0 ? loginScores[loginScores.length - 1] : 0;  // Get last score or fallback to 0


  const handlePostAction = (action, post) => {
    console.log(`Action: ${action} | Post ID: ${post.id}`);
  };

  const handlecollection = (action, post) => {
    console.log(`Action: ${action} | Post ID: ${post.id}`);
    sendPostData(post.id); // Call sendPostData with the post ID
  };
  
  let isRequestInProgress = false;

  const sendPostData = async (postId) => {
      if (isRequestInProgress) {
          console.log('Request already in progress, please wait...');
          return;  // Prevent further requests while one is in progress
      }
  
      console.log("sendPostData called with postId:", postId);
  
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
  
      if (!token) {
          console.log('No token or email found!');
          return;  // You may want to show an error or redirect the user
      }
  
      console.log("Sending post data:", { postId });
  
      isRequestInProgress = true;  // Set the flag to indicate a request is in progress
  
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/user/collect`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                  postId: postId
              }),
          });
  
          if (!response.ok) {
              console.error('API call failed:', response.status);
              return;
          }
  
          const data = await response.json();
          console.log('Response:', data);
      } catch (error) {
          console.error('Error sending post data:', error);
      } finally {
          isRequestInProgress = false;  // Reset the flag when the request finishes
      }
  };
  

  const renderMedia = (post) => {
    if (post.is_video && post.media) {
      return (
        <div className="my-4">
          <video controls className="w-full rounded-md shadow-md">
            <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
      return (
        <img
          src={post.thumbnail}
          alt="Post thumbnail"
          className="w-full h-auto rounded-md shadow-md mb-4"
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar onSearch={(term) => setSearchTerm(term)} />

    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/4 p-6 bg-[#f5f5f7] top-0 z-10 hidden sm:block">
      <div className="bg-white p-4 rounded-xl shadow-md">
  {/* Conditionally Render Profile Image or Initial Letter */}
  {user?.image ? (
    <img
      src={user.image}
      alt="Profile"
      className="w-32 h-32 rounded-full mx-auto mb-4"
    />
  ) : (
    <div className="bg-blue-500 text-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-4">
      <span className="text-xl font-semibold">
        {user?.username ? user.username.charAt(0).toUpperCase() : 'N/A'}
      </span>
    </div>
  )}

  {/* Username and Other Profile Information */}
  <h2
    className="text-center text-xl font-semibold text-[#0073b1] cursor-pointer hover:text-[#005682] underline"
    onClick={() => navigate('/profile')}
  >
    {user?.username || 'John Doe'}
  </h2>
  <br />
  <p className="text-center text-gray-600">{user?.name || 'Software Engineer'}</p>
  <p className="mt-2 text-center text-sm text-gray-500">{user?.bio || 'A passionate developer'}</p>

  {/* Score and Streak Section */}
  <div className="mt-4 text-center">
  <p className="text-lg font-medium text-gray-700">
      Score: <span className="text-[#0073b1]">{lastLoginScore}</span>
    </p>
    <p className="text-lg font-medium text-gray-700">
      Streak: <span className="text-[#0073b1]">{maxConsecutiveDays}</span>
    </p>
  </div>
</div>

  
  <div className="bg-white p-4 rounded-xl mt-4 shadow-md">
      {/* Play Game Section */}
      <div className="mt-6">
        <h3 className="text-center text-md font-semibold text-gray-800 mb-4">🎮 Play Game</h3>

        {/* Individual Game Cards */}
        <div className="space-y-4">
          {/* QueensChallenge */}
          <div
            onClick={() => navigate('/game/queens')}
            className="flex items-center p-4 bg-[#e6f0f8] rounded-lg shadow-sm hover:bg-[#d4e7f4] cursor-pointer"
          >
            <span className="text-3xl mr-4">👑</span>
            <p className="text-md font-medium text-[#0073b1]">QueensChallenge</p>
          </div>

          {/* BingoQuiz */}
          <div
            onClick={() => navigate('/game/inference')}
            className="flex items-center p-4 bg-[#e6f0f8] rounded-lg shadow-sm hover:bg-[#d4e7f4] cursor-pointer"
          >
            <span className="text-3xl mr-4">🎯</span>
            <p className="text-md font-medium text-[#0073b1]">BingoQuiz</p>
          </div>

          {/* CrossClimb */}
          <div
            onClick={() => navigate('/game/crossclimb')}
            className="flex items-center p-4 bg-[#e6f0f8] rounded-lg shadow-sm hover:bg-[#d4e7f4] cursor-pointer"
          >
            <span className="text-3xl mr-4">🧗‍♀️</span>
            <p className="text-md font-medium text-[#0073b1]">CrossClimb</p>
          </div>

          {/* TimedBingoGame */}
          <div
            onClick={() => navigate('/game/business-simulation')}
            className="flex items-center p-4 bg-[#e6f0f8] rounded-lg shadow-sm hover:bg-[#d4e7f4] cursor-pointer"
          >
            <span className="text-3xl mr-4">⏱️</span>
            <p className="text-md font-medium text-[#0073b1]">TimedBingoGame</p>
          </div>
        </div>
      </div>
    </div>
</div>



        <div className="w-full sm:w-2/4 p-6 overflow-y-auto">
          <div className="space-y-6 mt-6">
            {posts.map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#dfe3e8]"
              >
                <h3 className="font-semibold text-xl text-gray-800 hover:text-[#0073b1] mb-3">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Posted by <span className="font-semibold text-[#0073b1]">{post.author}</span> in
                  <span className="font-semibold text-[#0073b1]"> {post.subreddit}</span>
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Posted on: <span className="font-semibold text-[#0073b1]">
                    {formatDate(post.created_utc)}
                  </span>
                </p>

                {renderMedia(post)}

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0073b1] hover:text-[#005682] font-semibold"
                >
                  View Post
                </a>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <p>like: {post.score}</p>
                  <p>Comments: {post.num_comments}</p>
                </div>

                <div className="flex justify-start space-x-4 mt-4">
                  <FaThumbsUp
                    onClick={() => handlePostAction('Like', post)}
                    className="cursor-pointer text-[#0073b1] hover:text-[#005682]"
                  />
                  <FaShareAlt
                    onClick={() => handlePostAction('Share', post)}
                    className="cursor-pointer text-[#0073b1] hover:text-[#005682]"
                  />
                  <FaBookmark
                    onClick={() => handlecollection('Save', post)}
                    className="cursor-pointer text-[#0073b1] hover:text-[#005682]"
                  />
                  <FaFlag
  onClick={() => handleReport(post)}
  className="cursor-pointer text-[#0073b1] hover:text-[#005682]"
/>

                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center mt-6">
              <div className="animate-spin h-10 w-10 border-4 border-t-4 border-[#0073b1] border-solid rounded-full"></div>
              <p className="ml-3 text-[#0073b1]">Loading more posts...</p>
            </div>
          )}

          {!loading && after && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchPosts(true)}
                className="px-6 py-2 text-sm bg-[#0073b1] text-white rounded-full hover:bg-[#005682] transition-all duration-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>


        <div className="w-full sm:w-1/4 p-6 bg-[#f5f5f7] hidden sm:block">
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-4">Trending</h3>
            <ul>
              {trendingPosts.map((post, index) => (
                <li key={index} className="text-sm text-gray-600 mb-3">
                  <a href={post.url} className="text-[#0073b1] hover:text-[#005682]" target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>


<div className="bg-white p-4 rounded-xl shadow-md relative">
  <h3 className="text-xl font-semibold text-[#0073b1] mb-4">People You Might Know</h3>
  

  <button className="absolute top-4 right-4 text-sm text-[#0073b1] hover:text-[#005682]"
    onClick={() => navigate('/connections')}>
    View More
  </button>

  <ul>{
  peopleYouMightKnow.map((person) => (
    <li key={person.username} className="mb-4 flex justify-between items-center">
      <div className="flex flex-col">
        <h4 className="font-semibold text-gray-800">{person.name}</h4>
        <p className="text-sm text-gray-500">@{person.username}</p>
      </div>
      <div className="flex justify-end items-center space-x-4">
        <button className="px-4 py-2 bg-[#0073b1] text-white rounded-full flex items-center space-x-2 hover:bg-[#005682] text-sm">
          <FaUserPlus className="text-white" />
          <span>Connect</span>
        </button>
      </div>
    </li>
    ))}
  </ul>
</div>


        </div>
      </div>
    </div>
  );
};

export default RedditFeed;