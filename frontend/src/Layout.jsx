import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
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
                <Link to="/" onClick={closeMenu} className="flex items-center">
                    <span className="h-20 font-bold text-2xl">Journal App</span>
                </Link>
                
                <button onClick={toggleMenu} className="md:hidden text-black ml-auto">
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                <div className={`absolute inset-x-0 top-16 bg-[#B9B9B7] md:static md:flex md:space-x-8 p-4 text-white ${menuOpen ? 'block' : 'hidden'} md:block`}>
                    <ul className="flex flex-col md:flex-row md:space-x-8 ml-auto">
                        <li>
                            <Link to="/" onClick={closeMenu} className="text-bold text-xl block py-2 px-4 rounded hover:text-gray-400 hover:bg-green-800 dark:text-green-900" aria-current="page">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/journals" onClick={closeMenu} className="text-bold text-xl block py-2 px-4 rounded hover:text-gray-400 hover:bg-green-800 dark:text-green-900">
                                Journals
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" onClick={closeMenu} className="text-bold text-xl block py-2 px-4 rounded hover:text-gray-400 hover:bg-green-800 dark:text-green-900">
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" onClick={closeMenu} className="text-bold text-xl text-black hover:text-white block py-2 px-4 rounded border border-green-900 hover:bg-green-800">
                                Login
                            </Link>
                        </li>
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
