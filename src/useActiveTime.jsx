import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To detect route changes

const useActiveTime = () => {
  const [token, setToken] = useState(null);  // Add state to store token
  const startTimeRef = useRef(Date.now());
  const totalTimeRef = useRef(0);
  const isActive = useRef(true);
  const location = useLocation(); // Get the current route

  // Retrieve and parse the 'linkendin' object from localStorage inside useEffect
  useEffect(() => {
    const storedData = localStorage.getItem('linkendin');
    const parsed = storedData ? JSON.parse(storedData) : null;
    setToken(parsed?.token); // Set token after reading from localStorage
  }, []);  // Runs only once on component mount

  // Always set the effect and skip logic if no token
  useEffect(() => {
    if (!token) {
      console.error('[useActiveTime] No token found in localStorage.');
      return;  // Exit early if no token is found
    }

    console.log('[useActiveTime] useEffect triggered, checking LinkedIn authentication');
    
    // Function to send active time to the server with await using fetch
    const sendActiveTime = async (time) => {
      console.log(`[useActiveTime] Sending active time to server: ${time} seconds with token: ${token}`);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/time`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ activityTime: time }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send active time: ${response.statusText}`);
        }

        console.log(`[useActiveTime] Active time sent to server: ${time}`);
      } catch (error) {
        console.error('[useActiveTime] Error sending active time:', error.message);
      }
    };

    const updateTime = () => {
      if (isActive.current) {
        const now = Date.now();
        totalTimeRef.current += now - startTimeRef.current;
      }
      startTimeRef.current = Date.now();
    };

    // Handle visibility change (page is in background/foreground)
    const handleVisibilityChange = () => {
      console.log('[useActiveTime] Page visibility changed, updating active time');
      updateTime();
      const totalSeconds = Math.floor(totalTimeRef.current / 1000);
      console.log(`[useActiveTime] Active time on visibility change: ${totalSeconds} seconds`);
      isActive.current = !document.hidden;
    };

    // Handle page unload (e.g., user leaving the page)
    const handleUnload = async () => {
      console.log('[useActiveTime] Page is unloading, updating and sending active time');
      updateTime();
      const totalSeconds = Math.floor(totalTimeRef.current / 1000);
      console.log(`[useActiveTime] Final active time on unload: ${totalSeconds} seconds`);
      await sendActiveTime(totalSeconds);
    };

    // Handle route change
    const handleRouteChange = async () => {
      console.log('[useActiveTime] Route changed, updating and sending active time');
      updateTime();
      const totalSeconds = Math.floor(totalTimeRef.current / 1000);
      console.log(`[useActiveTime] Active time on route change: ${totalSeconds} seconds`);
      await sendActiveTime(totalSeconds);
      totalTimeRef.current = 0;
      startTimeRef.current = Date.now();
      console.log('[useActiveTime] Timer reset after route change');
    };

    // Listen for page visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Listen for window unload event (when the user navigates away or closes the tab)
    window.addEventListener('beforeunload', handleUnload);
    
    // Trigger route change handler when the route changes
    handleRouteChange();

    // Watch for route changes with location (this will handle the location change effectively)
    const unlisten = location.pathname;

    // Cleanup listeners when component unmounts
    return () => {
      console.log('[useActiveTime] Cleaning up event listeners');
      updateTime();
      handleUnload();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [location, token]);  // Trigger effect on route change or token change

};

export default useActiveTime;
