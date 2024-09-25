import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // Adjust the path as needed
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import ResetPassword from './pages/ResetPassword';
import RequestResetPassword from './pages/RequestResetPassword';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/journals" element={<Journal />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/request-reset-password" element={<RequestResetPassword />} />
                    {/* Add a default route or redirect as needed */}
                    <Route path="/" element={<Journal />} /> {/* Default to Journal page */}
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
