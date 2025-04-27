import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // For deleting posts from collection
import Navbar from './Navbar'; // Import your Navbar component

// Utility function to format the date in a readable format
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  return date.toLocaleDateString(); // This will return the date in "MM/DD/YYYY" format
};

const CollectionPage = () => {
  // List of post IDs (can be dynamic or static depending on your use case)
  const postIds = [
    '1k8lyi9',
    '1k8tysf',
    '1k8mcyg',
    // Add more post IDs as needed
  ];

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postDetails = await Promise.all(
          postIds.map(async (postId) => {
            const url = `https://www.reddit.com/by_id/t3_${postId}.json`;
            console.log(`Fetching data for post ID: ${postId}`);
            console.log(`Request URL: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`Failed to fetch post data for ${postId}. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response Data:', data);

            // Extract the post data from the response
            return data.data.children[0].data;
          })
        );

        // Update the state with the fetched posts
        setPosts(postDetails);
      } catch (err) {
        // Log the full error to help with debugging
        console.error('Error during fetch operation:', err);

        // Check if the error is a network error or a response error
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          setError('Network error or server not reachable. Please try again later.');
        } else {
          setError(`An error occurred: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postIds]);

  const handleRemoveFromCollection = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts); // Remove the post from the state
  };

  if (loading) {
    <div className="flex justify-center items-center mt-6">
              <div className="animate-spin h-10 w-10 border-4 border-t-4 border-[#0073b1] border-solid rounded-full"></div>
              <p className="ml-3 text-[#0073b1]">Loading posts...</p>
            </div>
  }

  if (error) {
   consolee.error('Error fetching posts:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="p-6 mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Your Collection</h2>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-[#dfe3e8]"
              >
                {/* Image or Video */}
                {post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ? (
                  <img
                    src={post.thumbnail}
                    alt="Post thumbnail"
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                ) : post.is_video && post.media ? (
                  <div className="my-4">
                    <video controls className="w-full rounded-md shadow-md">
                      <source src={post.media.reddit_video.fallback_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div> // Placeholder if no image or video
                )}

                <h3 className="font-semibold text-xl text-gray-800 hover:text-[#0073b1] mb-3">{post.title}</h3>

                <p className="text-sm text-gray-500 mb-3">
                  Posted by <span className="font-semibold text-[#0073b1]">{post.author}</span> in
                  <span className="font-semibold text-[#0073b1]"> {post.subreddit}</span>
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Posted on: <span className="font-semibold text-[#0073b1]">{formatDate(post.created_utc)}</span>
                </p>

                <a
                  href={`https://www.reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0073b1] hover:text-[#005682] font-semibold mb-4 block"
                >
                  View Post
                </a>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <p>Likes: {post.score}</p>
                  <p>Comments: {post.num_comments}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromCollection(post.id)}
                  className="mt-4 text-red-600 hover:text-red-800 flex items-center space-x-2"
                >
                  <FaTrashAlt />
                  <span>Remove from Collection</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts in your collection yet.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
