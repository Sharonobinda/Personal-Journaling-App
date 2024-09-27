// src/context/UserContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds the user data or null if not logged in

    // Simulate a login function for example purposes
    const login = (userData) => {
        setUser(userData);
    };

    // Simulate a logout function
    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
