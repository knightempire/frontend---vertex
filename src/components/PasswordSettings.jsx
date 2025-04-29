import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const PasswordSettings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [userName, setUserName] = useState('');
  const [Username, setUserId] = useState('');
  const [UsernameValid, setUserIdValid] = useState(false);
  const [UsernameMessage, setUserIdMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const milkyWhite = "#f5f5f7";
  const primaryColor = "#6366f1"; 
  const accentColor = "#ec4899"; 
  const darkColor = "#1e293b"; 
  const gradientButton = "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)";

  const validatePasswords = () => {
    let valid = true;
    setPasswordError('');
    setConfirmPasswordError('');
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }
    
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }
    
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const hashParams = new URLSearchParams(location.hash.replace('#', '?'));
    const type = hashParams.get('type');
    const token = new URLSearchParams(location.search).get('token');

    if (validatePasswords() && (type !== 'register' || UsernameValid)) {

      setLoading(true);

   

      let endpoint = '';
      let body 
      console.log("body",body);
      if (type === 'register') {
        endpoint = `${import.meta.env.VITE_API_URL}/user/password`;
        body = { username: Username, password: newPassword };

      } else if (type === 'forgot') {
        endpoint = `${import.meta.env.VITE_API_URL}/user/resetpassword`;
          body =  { password: newPassword };
          console.log("body",body);
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log('Response data:', data);
        if (response.ok) {
          Swal.fire({
            title: 'Success!',
            text: 'Your password has been set successfully',
            icon: 'success',
            confirmButtonColor: primaryColor,
            allowOutsideClick: false,
            confirmButtonText: 'Continue',
          }).then((result) => {
            if (result.isConfirmed) {
              // Navigate or handle the success action here
              navigate('/login');
            }
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Link has been expired or is invalid',
            icon: 'error',
            confirmButtonColor: primaryColor,
            allowOutsideClick: false,
            confirmButtonText: 'Retry',
          }).then((result) => {
            if (result.isConfirmed) {
              // Handle retry action
              navigate('/login');
            }
          });
        }

      } catch (err) {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Link has been expired or is invalid',
          icon: 'error',
          confirmButtonColor: primaryColor,
          allowOutsideClick: false,
          confirmButtonText: 'Retry',
        }).then((result) => {
          if (result.isConfirmed) {
            // Handle retry action
            navigate('/login');
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please make sure your Username is valid and your passwords match.',
        icon: 'error',
        confirmButtonColor: primaryColor,
        allowOutsideClick: false,
        confirmButtonText: 'Retry',
      });
    }
  };

  const handleUserIdBlur = async () => {
    console.log('Username field lost focus');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/check/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: Username }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserIdValid(true); // Mark the Username as valid
        setUserIdMessage('Username is available!'); // Success message
        console.log('Username check success:', data);
      } else {
        setUserIdValid(false); // Mark the Username as invalid
        setUserIdMessage('Username is already taken or invalid.'); // Error message
        console.error('Username check failed:', data);
        Swal.fire({
          title: 'Error',
          text: 'Username is already taken or invalid.',
          icon: 'error',
          confirmButtonColor: primaryColor,
        });
      }
    } catch (error) {
      setUserIdValid(false); // Mark the Username as invalid in case of an error
      setUserIdMessage('An error occurred while checking the Username.'); // Error message
      console.error('Error while checking Username:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while checking the Username.',
        icon: 'error',
        confirmButtonColor: primaryColor,
      });
    }
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace('#', '?'));
    const type = hashParams.get('type');
    const token = new URLSearchParams(location.search).get('token');

    if ((!type || (type !== 'register' && type !== 'forgot')) || !token) {
      Swal.fire({
        title: 'Error',
        text: 'Invalid URL or link. Please try again.',
        icon: 'error',
        confirmButtonColor: primaryColor,
        allowOutsideClick: false,
        confirmButtonText: 'Retry',
      }).then(() => {
        // Navigate or handle error
        navigate('/login');
      });
    } else {
      const verifyToken = async () => {
        try {
          const endpoint = type === 'register'
            ? `${import.meta.env.VITE_API_URL}/user/verify-token-register`
            : `${import.meta.env.VITE_API_URL}/user/verify-token-forgot`;
      
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
      
          const data = await response.json();
          console.log('Token verification response:', data);
          if (!response.ok) {
            Swal.fire({
              title: 'Error',
              text: data.message || 'Link has been expired or is invalid',
              icon: 'error',
              confirmButtonColor: primaryColor,
              confirmButtonText: 'Retry',
            }).then(() => {
              navigate('/login');  // Redirect to /login if response is not OK
            });
          } else {
            setUserName(data.user.name);
          }
      
        } catch (error) {
          console.error('Error verifying token:', error);
          Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred. Please try again.',
            icon: 'error',
            confirmButtonColor: primaryColor,
            allowOutsideClick: false,
            confirmButtonText: 'Retry',
          }).then(() => {
            navigate('/login');  // Redirect to /login in case of error
          });
        }
      };
      

      verifyToken();
    }
  }, [location]);

  return (
    <div className="h-screen w-full flex items-center justify-center" style={{ background: milkyWhite }}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: darkColor }}>
          Set Your Password
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Hi, {userName || 'user'}. Create a strong password for your account
        </p>

        <form onSubmit={handleSubmit}>

          {location.hash.includes('type=register') && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: darkColor }}>
                Username
              </label>
              <input
                type="text"
                value={Username}
                onChange={(e) => setUserId(e.target.value)}
                onBlur={handleUserIdBlur}
                className={`w-full px-3 py-2 border rounded-md`}
                style={{ borderColor: `${darkColor}20` }}
                placeholder="Enter your Username"
              />
              {UsernameMessage && (
                <p className={`text-sm mt-2 ${UsernameValid ? 'text-green-500' : 'text-red-500'}`}>
                  {UsernameMessage}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: darkColor }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${passwordError ? 'border-red-500' : ''}`}
              style={{ borderColor: `${darkColor}20` }}
              placeholder="Enter your new password"
            />
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: darkColor }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${confirmPasswordError ? 'border-red-500' : ''}`}
              style={{ borderColor: `${darkColor}20` }}
              placeholder="Confirm your password"
            />
            {confirmPasswordError && (
              <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (location.hash.includes('type=register') && !UsernameValid)}
            className="w-full font-medium py-2 rounded-md text-white relative overflow-hidden group"
            style={{ background: gradientButton }}
          >
            <span className="absolute inset-0 w-0 bg-opacity-30 transition-all duration-300 group-hover:w-full"
                  style={{ background: `rgba(255, 255, 255, 0.3)` }}></span>
            <span className="relative z-10">
              {loading ? 'Setting password...' : 'Set Password'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordSettings;


