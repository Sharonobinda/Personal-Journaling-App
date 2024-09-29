import React, { useState } from 'react';

const JournalEntryForm = ({ onEntryCreated, entryToEdit, onUpdateEntry }) => {
    const [title, setTitle] = useState(entryToEdit ? entryToEdit.title : '');
    const [content, setContent] = useState(entryToEdit ? entryToEdit.content : '');
    const [category, setCategory] = useState(entryToEdit ? entryToEdit.category : 'Personal'); // Default category

    const categories = ['Personal', 'Work', 'Travel', 'Health', 'Education']; // Define available categories

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entryToEdit) {
            onUpdateEntry(entryToEdit.id, title, content, category); // Update existing entry
        } else {
            onEntryCreated(title, content, category); // Create new entry
        }
        setTitle('');
        setContent('');
        setCategory('Personal'); // Reset category to default after submission
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{entryToEdit ? "Edit Journal Entry" : "Create Journal Entry"}</h2>
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full p-2 mb-4 border rounded"
                required 
            />
            <textarea 
                placeholder="Content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="w-full p-2 mb-4 border rounded"
                required 
            />
            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full p-2 mb-4 border rounded"
                required
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                {entryToEdit ? "Update Entry" : "Create Entry"}
            </button>
        </form>
    );
};

export default JournalEntryForm;
