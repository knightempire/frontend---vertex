import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/linkendin.png';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [loading, setLoading] = useState(false);  // Added loading state
    const navigate = useNavigate();

    // Function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setNameError('');
        setLoading(true); // Set loading to true when submitting the form

        // Validate Name
        if (!name) {
            setNameError('Name is required.');
            setLoading(false); // Set loading to false if validation fails
            return;
        }

        // Validate Email
        if (!email || !validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            setLoading(false); // Set loading to false if validation fails
            return;
        }

        const userData = { name, email };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error response
                console.error('Error response from server:', data);
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Something went wrong. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                setLoading(false); // Reset loading state after handling error
                return;
            }

            // If registration is successful, show success message
            Swal.fire({
                title: 'Registration Successful!',
                text: 'A verification link has been sent to your email.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login'); // Redirect to login after confirmation
            });

        } catch (error) {
            console.error('Error during registration:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while processing your request. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setLoading(false); // Reset loading state in case of error
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center" style={{ background: "#f5f5f7" }}>
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
            
            {/* Image Section */}
            <div className="flex justify-center mb-6">
            <img src="https://images.ctfassets.net/tyqyfq36jzv2/4LDyHu4fEajllYmI8y5bj7/124bcfb1b6a522326d7d90ac1e3debc8/Linkedin-logo-png.png" alt="Company Logo" className="h-12 cursor-pointer" />
            </div>
    
            {/* Create Account Title */}
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            
            {/* Form Section */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setNameError('')} // Clear error on focus
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter your Name"
                    />
                    {nameError && (
                        <div className="text-red-500 text-sm mt-1">{nameError}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailError('')} // Clear error on focus
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter your Email"
                    />
                    {emailError && (
                        <div className="text-red-500 text-sm mt-1">{emailError}</div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full font-medium py-2 rounded-md text-white"
                    style={{ background: "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)" }}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
    
            {/* Back to Login Link */}
            <div className="mt-4 text-center">
                <button onClick={() => navigate('/login')} className="text-sm text-blue-500">
                    Back to Login
                </button>
            </div>
        </div>
    </div>
    
    );
};

export default SignupPage;
