import React, { useState } from 'react';
import JournalEntryForm from '../components/JournalEntryForm';
import JournalList from '../components/JournalList';

const Dashboard = () => {
    const [entries, setEntries] = useState([]);
    const [entryToEdit, setEntryToEdit] = useState(null);

    const handleEntryCreated = (title, content, category) => {
        const newEntry = { id: Date.now(), title, content, category }; // Example of new entry creation
        setEntries([...entries, newEntry]);
    };

    const handleUpdateEntry = (id, title, content, category) => {
        const updatedEntries = entries.map((entry) => 
            entry.id === id ? { ...entry, title, content, category } : entry
        );
        setEntries(updatedEntries);
        setEntryToEdit(null); // Clear edit state after updating
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <JournalEntryForm 
                onEntryCreated={handleEntryCreated} 
                entryToEdit={entryToEdit} 
                onUpdateEntry={handleUpdateEntry} 
            />
            <JournalList entries={entries} onEdit={(entry) => setEntryToEdit(entry)} />
        </div>
    );
};

export default Dashboard;
