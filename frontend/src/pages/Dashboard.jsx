import React, { useContext } from 'react';
import { JournalContext } from '../context/JournalContext';
import JournalEntryForm from '../components/JournalEntryForm';
import JournalList from '../components/JournalList';

const Dashboard = () => {
    const { journals, createJournalEntry, updateJournalEntry, deleteJournalEntry } = useContext(JournalContext);

    const handleEntryCreated = (title, content, category) => {
        createJournalEntry(title, content, category);
    };

    const handleEntryUpdated = (id, title, content, category) => {
        updateJournalEntry(id, title, content, category);
    };

    const handleEntryDeleted = (id) => {
        deleteJournalEntry(id);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">My Journal Dashboard</h1>

            {/* Journal Entry Form */}
            <div className="mb-8">
                <JournalEntryForm onEntryCreated={handleEntryCreated} />
            </div>

            {/* Journal List */}
            <div>
                <JournalList 
                    journals={journals} 
                    onEntryUpdated={handleEntryUpdated} 
                    onEntryDeleted={handleEntryDeleted} 
                />
            </div>
        </div>
    );
};

export default Dashboard;
