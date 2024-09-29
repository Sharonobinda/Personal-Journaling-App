import React, { useState } from 'react';
import JournalEntryForm from './JournalEntryForm';

const JournalList = ({ journals, onEntryUpdated, onEntryDeleted }) => {
    const [editingEntry, setEditingEntry] = useState(null); // Track the entry being edited

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Your Journal Entries</h2>
            <ul className="space-y-4">
                {journals.length > 0 ? (
                    journals.map((journal) => (
                        <li key={journal.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg">{journal.title}</h3>
                                    <p className="text-gray-600">{journal.content}</p>
                                    <span className="text-gray-500 text-sm">{journal.category}</span>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setEditingEntry(journal)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => onEntryDeleted(journal.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No journal entries found. Start writing!</p>
                )}
            </ul>

            {/* Show the form for editing when an entry is selected */}
            {editingEntry && (
                <div className="mt-8">
                    <JournalEntryForm
                        entryToEdit={editingEntry}
                        onUpdateEntry={onEntryUpdated}
                    />
                </div>
            )}
        </div>
    );
};

export default JournalList;
