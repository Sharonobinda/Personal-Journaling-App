import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { JournalContext } from '../context/JournalContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast for notifications

const JournalList = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { currentUser, logout } = useContext(UserContext);
  const { journals, fetchJournals, deleteJournalEntry } = useContext(JournalContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournals(); // Fetch journals when component mounts
  }, []);

  const handleCreateJournal = () => {
    navigate('/create-journal'); // Navigate to the journal creation page
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  const handleDelete = (journalId) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(journalId); // Call deleteJournalEntry to delete the journal
      toast.success('Journal entry deleted successfully.'); // Notify user on success
    } else {
      toast.info('Journal entry not deleted.'); // Notify if action is cancelled
    }
  };

  const handleEdit = (journalId) => {
    navigate(`/edit-journal/${journalId}`); // Navigate to edit page with journalId
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif">My Journals</h1>
        <button
          className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
          onClick={handleCreateJournal}
        >
          +
        </button>
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 text-gray-900 bg-transparent border border-gray-900 rounded-full hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
            onClick={toggleProfileDropdown}
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div className="p-4 justify-between">
                <p className="text-gray-900 font-semibold">
                  Username: {currentUser ? currentUser.username : 'Guest'}
                </p>
                <button
                  className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded focus:outline-none"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {journals.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No journals added yet</p>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
              className="flex justify-between items-center bg-white p-4 mb-4 border rounded shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold">{journal.title}</h3>
                <p className="text-gray-500 text-sm">{journal.content}</p>
                <span className="text-xs text-gray-500">{journal.category}</span>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(journal.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-4">
                {/* Edit button */}
                <button
                  className="text-blue-500 focus:outline-none"
                  onClick={() => handleEdit(journal.id)}
                >
                  ✏️
                </button>

                {/* Delete button */}
                <button
                  className="text-red-500 focus:outline-none"
                  onClick={() => handleDelete(journal.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalList;
