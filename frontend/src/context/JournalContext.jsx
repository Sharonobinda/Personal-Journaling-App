import React, { createContext, useEffect, useState } from 'react';

// Create a Context for the journal
const JournalContext = createContext();

// Provider component
export const JournalProvider = ({ children }) => {
    const [journals, setJournals] = useState([]);

    // Fetch journals from the API
    const fetchJournals = () => {
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/journals', { // Adjusted API URL
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch journals');
            }
            return response.json();
        })
        .then((data) => {
            setJournals(data);
        })
        .catch((error) => {
            console.error('Error fetching journals:', error);
        });
    };

    // Create a new journal entry
    const createJournalEntry = (title, content, category) => {
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/journal', { // Adjusted API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content, category }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error creating journal entry');
            }
            return response.json();
        })
        .then(() => {
            fetchJournals(); // Refresh the journal list
        })
        .catch((error) => {
            console.error('Error creating journal entry:', error);
        });
    };

    // Fetch journals when the component mounts
    useEffect(() => {
        fetchJournals();
    }, []);

    return (
        <JournalContext.Provider value={{ journals, createJournalEntry }}>
            {children}
        </JournalContext.Provider>
    );
};

// Exporting the context itself for use in components
export const useJournalContext = () => {
    return useContext(JournalContext);
};
