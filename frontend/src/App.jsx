// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import { UserProvider } from './context/UserContext'; // Import the UserProvider

const App = () => {
    return (
        <UserProvider> {/* Wrap the app with UserProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Landing />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="journals" element={<Journal />} />
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
