// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ← added useLocation
import logo from '../assets/linkendin.png';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [emailError, setEmailError]     = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading]           = useState(false);

  const navigate = useNavigate();
  const location = useLocation();       // ← get the current URL

  const milkyWhite     = "#f5f5f7";
  const primaryColor   = "#6366f1";
  const darkColor      = "#1e293b";
  const gradientButton = "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)";

  // 1) Single effect handles both:
  //    • Google callback ?token=… 
  //    • existing localStorage token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      // Save the OAuth JWT and go straight to feed
      localStorage.setItem('linkendin', JSON.stringify({ token: urlToken }));
      console.log('Google token saved to localStorage:', urlToken);
      verifyToken(urlToken);
    }

    // Otherwise, if we already have a token, verify it
    const stored = localStorage.getItem('linkendin');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) verifyToken(token);
    }
  }, [location.search, navigate]);

  // Verify JWT w/ your backend
  const verifyToken = async (token) => {
    console.log('Verifying token:', token); // Log token verification attempt
  
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/verify-token`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!res.ok) {
        console.log('Token verification failed:', res.statusText); // Log if the response is not ok
        localStorage.removeItem('linkendin');
        return;
      }
  
      const data = await res.json();
      console.log('Token verified successfully:', data); // Log the successful verification response data
  
      // Store token and role information in localStorage
      const { role } = data.user; // Assuming data includes user info
      localStorage.setItem(
        'linkendin',
        JSON.stringify({ token, role, name: btoa(data.user.name) })
      );
  
      // Navigate based on user role
      if (role === 'admin') {
        console.log('Navigating to admin page');
        navigate('/admin');
      } else if (role === 'user') {
        console.log('Navigating to feed page');
        navigate('/feed');
      }
    } catch (err) {
      console.error('Error verifying token:', err); // Log any error encountered during token verification
    }
  };
  

  // Email format check
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Traditional login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoading(true);

    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      setLoading(false);
      return;
    }
    if (!password) {
      setPasswordError('Password is required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        const base64Name = btoa(data.user.name);
        localStorage.setItem(
          'linkendin',
          JSON.stringify({ token: data.token, name: base64Name })
        );
        navigate('/feed');
      } else {
        setPasswordError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setPasswordError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center"
      style={{ background: milkyWhite }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-lg"
        style={{ backgroundColor: 'white' }}
      >
        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={() => navigate('/feed')}
        >
          <img src="https://images.ctfassets.net/tyqyfq36jzv2/4LDyHu4fEajllYmI8y5bj7/124bcfb1b6a522326d7d90ac1e3debc8/Linkedin-logo-png.png" alt="Company Logo" className="h-12" />
        </div>

        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: darkColor }}
        >
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: darkColor }}
            >
              Email Address
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailError('')}
              className="w-full px-3 py-2 border rounded-md"
              style={{ borderColor: `${darkColor}20` }}
              placeholder="Enter your Email"
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: darkColor }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordError('')}
              className="w-full px-3 py-2 border rounded-md"
              style={{ borderColor: `${darkColor}20` }}
              placeholder="Enter Password"
            />
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium py-2 rounded-md text-white relative overflow-hidden group"
            style={{ background: gradientButton }}
          >
            <span
              className="absolute inset-0 w-0 bg-opacity-30 transition-all duration-300 group-hover:w-full"
              style={{ background: 'rgba(255, 255, 255, 0.3)' }}
            />
            <span className="relative z-10">
              {loading ? 'Logging in...' : 'Login'}
            </span>
          </button>
        </form>

        <div className="mt-4 text-right">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm"
            style={{ color: primaryColor }}
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/SignupPage')}
              className="text-sm font-medium"
              style={{ color: primaryColor }}
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Google Login Button */}
        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
