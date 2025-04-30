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

    // Add more post IDs as needed
  ];

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const callApiToGetPostIds = async () => {
    console.log("Fetching post IDs from API...");
  
    try {
      // Example: Assume token is available (from localStorage or context)
      const storedData = localStorage.getItem('linkendin');
      const parsed = storedData && JSON.parse(storedData);
      const token = parsed?.token;
      console.log('Token:', token);
      
      if (!token) {
        console.error("No token found");
        return;
      }
  
      // Call the API to get post IDs
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/view/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Error fetching post IDs from API:", response.status);
        return;
      }
  
      const data = await response.json();
      console.log("API response:", data); // Print the response data
  
      // Assuming the response structure has postIds array
      return data.postIds;
  
    } catch (err) {
      console.error('Error during fetch operation:', err);
      return [];
    }
  };
  
  


  const fetchPosts = async () => {
    console.log("Fetching posts...");
    setLoading(true);
    
    try {
      // Load cached posts from localStorage
      const cachedPosts = localStorage.getItem('collectionPosts');
      const cachedPostsArray = cachedPosts ? JSON.parse(cachedPosts) : [];
      
      // Fetch post IDs from the API
      const postIds = await callApiToGetPostIds();
  
      if (postIds.length === 0) {
        console.log("No post IDs received from the API.");
        setLoading(false);
        return;
      }
  
      const existingPostsMap = new Map(
        cachedPostsArray.map(post => [post.id.replace('t3_', ''), post])
      );
  
      const missingPostIds = postIds.filter(postId => 
        !existingPostsMap.has(postId)
      );
  
      console.log("Missing post IDs:", missingPostIds);
      
      if (missingPostIds.length > 0) {
        console.log("Fetching missing posts from API...");
        
        // Fetch missing posts in parallel
        const newPostsResponses = await Promise.all(
          missingPostIds.map(postId => 
            fetch(`https://www.reddit.com/by_id/t3_${postId}.json`)
              .then(response => {
                if (!response.ok) {
                  console.error(`Error fetching post ${postId}:`, response.status);
                  return null;
                }
                return response.json();
              })
              .then(data => data?.data?.children[0]?.data || null)
              .catch(error => {
                console.error(`Error fetching post ${postId}:`, error);
                return null;
              })
          )
        );
  
        const validNewPosts = newPostsResponses.filter(post => post !== null);
  
        // Combine cached and new posts
        const allPosts = [...cachedPostsArray, ...validNewPosts];
  
        setPosts(allPosts);
        localStorage.setItem('collectionPosts', JSON.stringify(allPosts));
        
        console.log(`Added ${validNewPosts.length} new posts to collection`);
      } else {
        console.log("All posts already cached, no need to fetch");
        setPosts(cachedPostsArray);
      }
    } catch (err) {
      console.error('Error during fetch operation:', err);
      setError('There was an error fetching the posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  useEffect(() => {
    console.log("Component mounted, fetching posts...");

    fetchPosts();
  }, []);

  let isRequestInProgress = false; // Flag to prevent concurrent API requests

  // Function to handle the removal of the post from the collection
  const handleRemoveFromCollection = async (postId) => {
    console.log(`Removing post with ID ${postId} from collection...`);
  
    // Remove the post from the current state
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts); // Update state with the new list of posts
  
    // Update the localStorage cache after removal
    localStorage.setItem('collectionPosts', JSON.stringify(updatedPosts));
  
    console.log("Updated posts after removal:", updatedPosts); // Debug: Updated posts after removal
  
    // Send the post removal data to the API
    await sendPostData(postId); // Send the postId to the backend
  };
  
  // Function to send post data (for example, to notify the backend about the removal)
  const sendPostData = async (postId) => {
    if (isRequestInProgress) {
      console.log('Request already in progress, please wait...');
      return; // Prevent further requests while one is in progress
    }
  
    console.log("sendPostData called with postId:", postId);
  
    const storedData = localStorage.getItem('linkendin');
    const parsed = storedData && JSON.parse(storedData);
    const token = parsed?.token;
  
    if (!token) {
      console.log('No token or email found!');
      return; // You may want to show an error or redirect the user
    }
  
    console.log("Sending post data:", { postId });
  
    isRequestInProgress = true;  // Set the flag to indicate a request is in progress
  
    try {
      // API call to remove the post from the user's collection
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: postId,
        }),
      });
  
      if (!response.ok) {
        console.error('API call failed:', response.status);
        return;
      }
  
      const data = await response.json();
      console.log('Response from API:', data);
  
      // Optionally, handle the response (e.g., showing a success message)
    } catch (error) {
      console.error('Error sending post data:', error);
    } finally {
      isRequestInProgress = false;  // Reset the flag once the request completes
    }
  };
  

  // Render Media function
  const renderMedia = (post) => {
    console.log(`Rendering media for post with ID: ${post.id}`);
    console.log("Post media object:", post.media); 


    if (post.is_video && post.media && post.media.reddit_video) {
      const videoUrl = post.media.reddit_video.fallback_url;
      console.log("Video URL:", videoUrl); 

      if (videoUrl) {
        return (
          <div className="my-4">
            <video controls className="w-full rounded-md shadow-md">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      } else {
        console.log("No video URL found for this post."); L
      }
    }

    // If post has an image (thumbnail), render the image
    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
      console.log("Rendering image thumbnail:", post.thumbnail); 
      return (
        <img
          src={post.thumbnail}
          alt="Post thumbnail"
          className="w-full h-auto rounded-md shadow-md mb-4"
        />
      );
    }

    // Default if no video or image found
    console.log("No media found for post with ID:", post.id); 
    return <div className="w-full h-48 bg-gray-300 rounded-md mb-4">No media available</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-6">
        <div className="animate-spin h-10 w-10 border-4 border-t-4 border-[#0073b1] border-solid rounded-full"></div>
        <p className="ml-3 text-[#0073b1]">Loading your collection...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="p-6 mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Your Collection</h2>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              console.log(`Rendering post with ID: ${post.id}`); 
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-[#dfe3e8]"
                >
                  {/* Image or Video */}
                  {renderMedia(post)}

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
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts in your collection yet.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
