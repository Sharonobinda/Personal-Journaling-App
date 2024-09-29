import React, { useContext } from 'react';
import { JournalContext } from '../context/JournalContext';  // This will now work
import JournalEntryForm from '../components/JournalEntryForm';
import JournalList from '../components/JournalList';

const JournalPage = () => {
    const { journals, createJournalEntry } = useContext(JournalContext); 

    const handleEntryCreated = (title, content, category) => {
        createJournalEntry(title, content, category);
    };

    return (
        <div>
            <JournalEntryForm onEntryCreated={handleEntryCreated} />
            <JournalList journals={journals} />
        </div>
    );
};

export default JournalPage;
