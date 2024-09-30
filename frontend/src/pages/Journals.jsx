import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  const handleCreateJournal = () => {
    // Navigate to the CreateJournal page
    navigate('/create-journal');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif">Personal Journals</h1>
        <button
          className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
          onClick={handleCreateJournal}
        >
          +
        </button> {/* Handle the click */}
        <button
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 text-gray-900 bg-transparent border border-gray-900 rounded-full hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
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
          {/* Add additional text here if needed */}
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <span>Filter by:</span>
        <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring">
          <option value="all">All</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>
      </div>

      {/* Journal Items */}
      <div>
        {journals.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No journals added yet</p>
        ) : (
          journals.map((journal) => (
            <div key={journal.id} className="flex justify-between items-center bg-white p-4 mb-4 border rounded shadow-sm">
              <div>
                <h3 className="text-lg font-semibold">{journal.title}</h3>
                <p className="text-gray-500 text-sm">{journal.date}</p>
                <span className="text-xs text-gray-500">{journal.type}</span>
              </div>
              <div className="flex space-x-4">
                <button className="text-blue-500 focus:outline-none">✏️</button>
                <button className="text-red-500 focus:outline-none">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalList;
