import React from 'react';

// Google official G logo (small, lightweight SVG)
const googleLogo =
  "https://developers.google.com/identity/images/g-logo.png";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Example redirect for Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center py-2 mt-4 rounded-md shadow-md text-gray-700 font-semibold bg-white border hover:bg-gray-100 transition duration-300 ease-in-out"
    >
      <img
        src={googleLogo}
        alt="Google Logo"
        className="w-5 h-5 mr-3"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
