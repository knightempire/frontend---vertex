import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/linkendin.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const milkyWhite = "#f5f5f7";
  const primaryColor = "#6366f1"; 
  const accentColor = "#ec4899"; 
  const darkColor = "#1e293b"; 
  const gradientButton = "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)";

  // Function to verify the token
  const verifyToken = async (token) => {
    console.log('Verifying token:', token);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/verify-token`, {
        method: 'GET', // Assuming it's a GET request; change if necessary
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token verification failed:', errorData);
        // Remove the token from localStorage if verification fails
        localStorage.removeItem('linkendin');
        return;
      }

      const data = await response.json();
      console.log('Token verification successful:', data);
      console.log('Username:', data.user.username); // Print the username
      navigate('/cards');
    } catch (error) {
      console.error('Error during token verification:', error);
    }
  };

  // Check token on component mount (onload)
  useEffect(() => {
    const storedData = localStorage.getItem('linkendin');
    if (storedData) {
      const { token } = JSON.parse(storedData);
      if (token) {
        console.log('Token found in localStorage:', token);
        verifyToken(token); // Call the verifyToken function
      }
    }
  }, []); // Empty array means this runs only on initial render

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);

        const base64Name = btoa(data.user.name); 
        localStorage.setItem('linkendin', JSON.stringify({ token: data.token, name: base64Name }));
        navigate('/cards');
      } else {
        console.log(data);
        setPasswordError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center" style={{ background: milkyWhite }}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
      <div className="flex justify-center mb-6" onClick={() => navigate('/')}>
          <img src="https://images.ctfassets.net/tyqyfq36jzv2/4LDyHu4fEajllYmI8y5bj7/124bcfb1b6a522326d7d90ac1e3debc8/Linkedin-logo-png.png" alt="Company Logo" className="h-12 cursor-pointer" />
        </div>

        
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: darkColor }}>
          Log in to your account
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: darkColor }}>
              Email Address
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailError('')} // Clear error on focus
              className="w-full px-3 py-2 border rounded-md"
              style={{ borderColor: `${darkColor}20` }}
              placeholder="Enter your Email"
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: darkColor }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordError('')} // Clear error on focus
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
            <span className="absolute inset-0 w-0 bg-opacity-30 transition-all duration-300 group-hover:w-full" 
                  style={{ background: `rgba(255, 255, 255, 0.3)` }}></span>
            <span className="relative z-10">
              {loading ? 'Logging in...' : 'Login'}
            </span>
          </button>
        </form>
        
        <div className="mt-4 text-right">
          <a 
            href="#" 
            className="text-sm"
            style={{ color: primaryColor }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot your password?
          </a>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account? {" "}
            <button 
              onClick={() => navigate('/SignupPage')} 
              className="text-sm font-medium"
              style={{ color: primaryColor }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
