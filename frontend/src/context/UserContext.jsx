// src/context/UserContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds the user data or null if not logged in

    // Login function
    const login = (email, password, callback) => {
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Login failed!');
                }
                return response.json();
            })
            .then((data) => {
                setUser(data.user); // Assuming the response contains user data
                localStorage.setItem('token', data.token); // Store token if needed
                callback(); // Navigate after successful login
            })
            .catch((error) => {
                console.error('Error during login:', error);
                // Optionally show a toast notification or error message
            });
    };

    // Registration function
    const register = (username, email, password, callback) => {
        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Registration failed!');
                }
                return response.json();
            })
            .then((data) => {
                setUser(data.user); // Assuming the response contains user data
                localStorage.setItem('token', data.token); // Store token if needed
                callback(); // Navigate after successful registration
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                // Optionally show a toast notification or error message
            });
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Remove token on logout
        // Optionally, navigate to login or home page
    };

    // Update profile function
    const updateProfile = (updatedData, callback) => {
        const token = localStorage.getItem('token'); // Get the token for authorization
        fetch('http://127.0.0.1:5000/update-profile', {
            method: 'PUT', // Assuming you're using PUT for updating
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add token to headers
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Profile update failed!');
                }
                return response.json();
            })
            .then((data) => {
                setUser(data.user); // Update the user state with new data
                callback(); // Optionally navigate or show success message
            })
            .catch((error) => {
                console.error('Error during profile update:', error);
                // Optionally show a toast notification or error message
            });
    };

    return (
        <UserContext.Provider value={{ user, login, register, logout, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};
