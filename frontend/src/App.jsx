import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Journal from './pages/Journal';
import Dashboard from './pages/Dashboard';
import { UserProvider } from './context/UserContext'; // Import the UserProvider
import { JournalProvider } from './context/JournalContext';

const App = () => {
    return (
        <Router> {/* Place the Router at the top */}
            <UserProvider> {/* Now UserProvider is inside the Router */}
                <JournalProvider> {/* JournalProvider also inside the Router */}
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Landing />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="journals" element={<Journal />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                    </Routes>
                </JournalProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
