import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Journals from './pages/Journals';
import CreateJournal from './pages/CreateJournal';  // Keep the import
import EditJournal from './pages/EditJournal';
import { UserProvider } from './context/UserContext';
import { JournalProvider } from './context/JournalContext';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordReset from './pages/PasswordReset';


const App = () => {
    return (
        <Router>
            <UserProvider>
                <JournalProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Landing />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="journals" element={<Journals />} />
                            <Route path="create-journal" element={<CreateJournal />} /> {/* Add route for CreateJournal */}
                            <Route path="/edit-journal/:id" element={<EditJournal />} />
                            <Route path="password-reset-request" element={<PasswordResetRequest />} />
                            <Route path="password-reset/:token" element={<PasswordReset />} />
                        </Route>
                    </Routes>
                </JournalProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
