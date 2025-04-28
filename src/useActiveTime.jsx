import { useEffect, useRef } from 'react';

const useActiveTime = (userId) => {
  const startTimeRef = useRef(Date.now());
  const totalTimeRef = useRef(0);
  const isActive = useRef(true);

  const updateTime = () => {
    if (isActive.current) {
      const now = Date.now();
      totalTimeRef.current += now - startTimeRef.current;
    }
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      updateTime();

      const totalSeconds = Math.floor(totalTimeRef.current / 1000);
      console.log(`[Time Tracker] Active time: ${totalSeconds} seconds`);
      
      isActive.current = !document.hidden;
    };

    const handleUnload = () => {
      updateTime();
      const totalSeconds = Math.floor(totalTimeRef.current / 1000);

      console.log(`[Time Tracker] Final active time: ${totalSeconds} seconds`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      updateTime();
      handleUnload();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [userId]);
};

export default useActiveTime;
