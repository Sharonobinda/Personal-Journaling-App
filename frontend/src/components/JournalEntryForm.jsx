import React, { useState } from 'react';

const JournalEntryForm = ({ onEntryCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onEntryCreated(title, content, category); // Pass parameters to the parent
        setTitle('');
        setContent('');
        setCategory('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Journal Entry</h2>
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
            />
            <button type="submit">Create Entry</button>
        </form>
    );
};

export default JournalEntryForm;
