import React, { useState } from 'react';

const JournalEntryForm = ({ onEntryCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

        fetch('/journal', {
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
            onEntryCreated(); // Notify parent to refresh journal list
            setTitle('');
            setContent('');
            setCategory('');
        })
        .catch((error) => {
            console.error('Error creating journal entry:', error);
        });
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
