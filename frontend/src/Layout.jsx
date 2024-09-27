import React, { useState, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserContext } from './context/UserContext'; // Assuming UserContext is used for authentication
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
        <div className="bg-[#B9B9B7] min-h-screen flex flex-col">
            <nav className='flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-40 pt-10 relative'>
                {/* Removed the empty Link element entirely */}
                
                <button onClick={toggleMenu} className="md:hidden text-black ml-auto">
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                <div className={`absolute inset-x-0 top-16 bg-[#B9B9B7] md:static md:flex md:space-x-8 p-4 text-white ${menuOpen ? 'block' : 'hidden'} md:block`}>
                    <ul className="flex flex-col md:flex-row md:space-x-8 ml-auto">
                        {/* Only show Journals if the user is logged in */}
                        {user && (
                            <li>
                                <Link to="/journals" onClick={closeMenu} className="text-bold text-xl block py-2 px-4 rounded hover:text-gray-400 hover:bg-green-800 dark:text-green-900">
                                    Journals
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            <main className="flex-grow p-4">
                <ToastContainer />
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
