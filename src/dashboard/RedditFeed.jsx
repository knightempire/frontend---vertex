import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import moment from 'moment'; // Import moment.js
import Navbar from './Navbar'; // Import Navbar component
import { FaThumbsUp, FaShareAlt, FaBookmark } from 'react-icons/fa'; // Importing icons from react-icons

const RedditFeed = () => {
  const [posts, setPosts] = useState([]); // Stores posts
  const [loading, setLoading] = useState(false); // To control loading state
  const feedEndRef = useRef(null); // Reference for the end of the feed to trigger more posts
  const [after, setAfter] = useState(null); // Pagination 'after' value for Reddit API
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering posts

  const primaryColor = "#0073b1"; // LinkedIn-like blue
  const milkyWhite = "#f5f5f7"; // Light gray background
  const darkColor = "#333"; // Darker text color for readability
  const lightGray = "#dfe3e8"; // Lighter gray for borders and dividers

  // Convert UTC timestamp to Asia timezone (IST) in dd-mm-yyyy hh:mm format using moment
  const formatDate = (timestamp) => {
    return moment.unix(timestamp).utcOffset(330).format('DD-MM-YYYY HH:mm'); // Asia/Calcutta (UTC+5:30)
  };

  // Fetch posts from Reddit based on the search term
  const fetchPosts = async (manualLoad = false) => {
    if (loading) return; // Prevent multiple concurrent fetches

    setLoading(true);

    // Modify URL based on the search term
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

        // Update the 'after' value for the next batch of posts
        setAfter(data.data.after);
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

  // Fetch initial posts when component is mounted or searchTerm changes
  useEffect(() => {
    fetchPosts();
  }, [searchTerm]); // Re-fetch posts when the search term changes

  // Function to handle Like, Share, Save click
  const handlePostAction = (action, post) => {
    console.log(`Action: ${action} | Post ID: ${post.id} `);
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

    return null; // No media
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearch={(term) => setSearchTerm(term)} /> {/* Pass search handler to Navbar */}

      <div className="flex flex-col sm:flex-row">

        <div className="w-full sm:w-1/4 p-6 bg-[#f5f5f7] top-0 z-10">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <img src="https://via.placeholder.com/150" alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
            <h2 className="text-center text-xl font-semibold text-[#0073b1]">John Doe</h2>
            <p className="text-center text-gray-600">Software Engineer</p>
            <p className="mt-4 text-center text-sm text-gray-500">A passionate developer who loves coding and technology.</p>
            <div className="mt-4 text-center">
              <button className="px-6 py-2 text-sm bg-[#0073b1] text-white rounded-full hover:bg-[#005682]">Connect</button>
            </div>
          </div>
        </div>

        {/* Middle Section: Posts (scrollable) */}
        <div className="w-full sm:w-2/4 p-6 overflow-y-auto">
          <div className="space-y-6 mt-6">
            {posts.map((post, index) => (
              <div
                key={`${post.id}-${index}`} // Using a combination of post.id and index to ensure unique key
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

                {renderMedia(post)} {/* This is where we render the image or video */}

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0073b1] hover:text-[#005682] font-semibold"
                >
                  View Post
                </a>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <p>Score: {post.score}</p>
                  <p>Comments: {post.num_comments}</p>
                </div>

                {/* Action Icons: Like, Share, Save */}
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
                    onClick={() => handlePostAction('Save', post)}
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

        {/* Right Sidebar: Scorable content (scrollable) */}
        <div className="w-full sm:w-1/4 p-6 bg-[#f5f5f7] hidden sm:block">
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-4">Scoreboard</h3>
            <ul>
              <li className="flex justify-between text-sm text-gray-600 mb-3">
                <span>User1</span>
                <span>Score: 150</span>
              </li>
              <li className="flex justify-between text-sm text-gray-600 mb-3">
                <span>User2</span>
                <span>Score: 120</span>
              </li>
              <li className="flex justify-between text-sm text-gray-600 mb-3">
                <span>User3</span>
                <span>Score: 100</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-[#0073b1] mb-4">Trending</h3>
            <ul>
              <li className="text-sm text-gray-600 mb-3">Post 1 - Top Trend</li>
              <li className="text-sm text-gray-600 mb-3">Post 2 - Trending Now</li>
              <li className="text-sm text-gray-600 mb-3">Post 3 - Hot Topic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedditFeed;
