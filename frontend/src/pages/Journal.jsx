import React, { useState, useEffect } from 'react';
import JournalEntryForm from '../components/JournalEntryForm';
import JournalList from '../components/JournalList';

const JournalPage = () => {
    const [journals, setJournals] = useState([]);

    const fetchJournals = () => {
        const token = localStorage.getItem('token');

        fetch('/journals', {
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

    useEffect(() => {
        fetchJournals();
    }, []);

    return (
        <div>
            <JournalEntryForm onEntryCreated={fetchJournals} />
            <JournalList journals={journals} />
        </div>
    );
};

export default JournalPage;
