import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const RedditFeed = () => {
  const [posts, setPosts] = useState([]); // Stores posts
  const [loading, setLoading] = useState(false); // To control loading state
  const feedEndRef = useRef(null);  // Reference for the end of the feed to trigger more posts
  const [after, setAfter] = useState(null); // Pagination 'after' value for Reddit API

  const primaryColor = "#0073b1";  // LinkedIn-like blue
  const milkyWhite = "#f5f5f7";  // Light gray background
  const darkColor = "#333";  // Darker text color for readability
  const lightGray = "#dfe3e8";  // Lighter gray for borders and dividers

  // Fetch posts from Reddit
  const fetchPosts = async (manualLoad = false) => {
    if (loading) return; // Prevent multiple concurrent fetches

    setLoading(true);
    const url = after
      ? `https://www.reddit.com/r/all/top.json?after=${after}`
      : 'https://www.reddit.com/r/all/top.json';

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const newPosts = data.data.children.map(post => ({
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
        }));

        // Append the new posts to the existing posts
        setPosts(prevPosts => [...prevPosts, ...newPosts]);

        // Update the 'after' value for the next batch of posts
        setAfter(data.data.after);

        // Log the total posts fetched in this batch
        console.log('Total posts fetched:', data.data.dist);
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

  // Fetch initial posts when component is mounted
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle scroll for infinite loading
  const handleScroll = () => {
    const bottom = feedEndRef.current.getBoundingClientRect().bottom <= window.innerHeight;
    if (bottom && !loading && after) {
      console.log("You came to the end!"); // Log when the user reaches the end
      fetchPosts();  // Fetch more posts when reaching the bottom
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, after]);  // Dependency array includes loading and 'after' to trigger on change

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-center text-[#0073b1]">Top Reddit Posts</h2>
        
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}  // Using 'id' from Reddit for unique key
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-[#dfe3e8]"
            >
              <h3 className="font-semibold text-xl text-gray-800 hover:text-[#0073b1] mb-3">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Posted by <span className="font-semibold text-[#0073b1]">{post.author}</span> in 
                <span className="font-semibold text-[#0073b1]"> {post.subreddit}</span>
              </p>
              
              {renderMedia(post)}  {/* This is where we render the image or video */}

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
       
                <div className="space-x-3">
                  <button
                    aria-label="Like post"
                    className="px-4 py-2 text-sm bg-[#0073b1] text-white rounded-full hover:bg-[#005682] transition-all duration-200"
                  >
                    Like
                  </button>
                  <button
                    aria-label="Share post"
                    className="px-4 py-2 text-sm bg-[#0073b1] text-white rounded-full hover:bg-[#005682] transition-all duration-200"
                  >
                    Share
                  </button>
                </div>
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

      <div ref={feedEndRef}></div>
    </div>
  );
};

export default RedditFeed;
