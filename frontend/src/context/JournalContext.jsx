import React, { createContext, useState, useEffect } from 'react';

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
    const [journals, setJournals] = useState([]);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    useEffect(() => {
        if (authToken) {
            fetchJournals();
        }
    }, [authToken]);

    const fetchJournals = () => {
        fetch('http://localhost:5000/journals', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setJournals(data))
            .catch((error) => console.error('Error fetching journals:', error));
    };

    const createJournalEntry = (title, content, category) => {
        fetch('http://localhost:5000/journals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ title, content, category }),
        })
            .then(() => fetchJournals())
            .catch((error) => console.error('Error creating journal entry:', error));
    };

    const updateJournalEntry = (id, title, content, category) => {
        fetch(`http://localhost:5000/journals/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ title, content, category }),
        })
            .then(() => fetchJournals())
            .catch((error) => console.error('Error updating journal entry:', error));
    };

    const deleteJournalEntry = (id) => {
        fetch(`http://localhost:5000/journals/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then(() => fetchJournals())
            .catch((error) => console.error('Error deleting journal entry:', error));
    };

    return (
        <JournalContext.Provider
            value={{
                journals,
                createJournalEntry,
                updateJournalEntry,
                deleteJournalEntry,
            }}
        >
            {children}
        </JournalContext.Provider>
    );
};
