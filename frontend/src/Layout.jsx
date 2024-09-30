import React, { useState, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserContext } from './context/UserContext';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    const { user } = useContext(UserContext); // Assuming `user` is the logged-in user
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        // Wrap everything in a single enclosing tag
        <>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/profile" className="text-lg text-gray-700 hover:text-gray-900">Profile</Link>
                    </li>
                    {/* Only show Journals if the user is logged in */}
                    {user && (
                        <li>
                            <Link to="/journals" className="text-lg text-gray-700 hover:text-gray-900">My Journals</Link>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <div className="relative">
                    <Outlet />
                    
                    {/* Floating Circle Button for Creating New Journal */}
                    {user && (
                        <Link
                            to="/create-journal"
                            className="fixed bottom-10 right-10 bg-green-600 text-white rounded-full p-5 shadow-lg hover:bg-green-700 transition duration-300 ease-in-out"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer />
        </>
    );
};

export default Layout;
