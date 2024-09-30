import React from 'react';

const JournalList = ({ entries, onEdit }) => {
    return (
        <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-4">Journal Entries</h2>
            <ul>
                {entries.map((entry) => (
                    <li key={entry.id} className="border-b p-2 flex justify-between">
                        <div>
                            <h3 className="font-bold">{entry.title}</h3>
                            <p>{entry.content}</p>
                            <p className="text-gray-500">{entry.category}</p>
                        </div>
                        <button onClick={() => onEdit(entry)} className="text-blue-500">
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JournalList;
