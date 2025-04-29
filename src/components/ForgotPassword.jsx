import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    // Function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');  // Reset the error

        // Check if the email is valid
        if (!email || !validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        const email = email;
        const requestData = { email };

        try {
            // Make the API call to request a password reset link
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error response (e.g., invalid email)
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Something went wrong. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // If successful, show success message
            Swal.fire({
                title: 'Reset Link Sent!',
                text: 'A reset link has been sent to your email.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/login'); // Redirect to login after confirmation
            });

        } catch (error) {
            console.error('Error during password reset:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while processing your request. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center" style={{ background: "#f5f5f7" }}>
            <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'white' }}>
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
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
                    >
                        Send Reset Link
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button onClick={() => navigate('/login')} className="text-sm text-blue-500">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
