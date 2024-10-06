import React, { useState, useContext } from 'react';
import { JournalContext } from '../context/JournalContext'; // Adjust the path as needed

const CreateJournal = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const { createJournalEntry } = useContext(JournalContext); // Access the context

  const handleSubmit = (e) => {
    e.preventDefault();
    createJournalEntry(title, content, category); // Call the function to create the journal entry
    setTitle(''); // Clear the input fields
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Journal</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
        required
      />
      <textarea
        placeholder="Journal Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded p-2 mb-4 w-full">
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="travel">Travel</option>
        <option value="health">Health</option>
        <option value="education">Education</option>
      </select>
      
      <button type="submit" className="bg-blue-500 text-white rounded p-2">Create</button>
    </form>
  );
};

export default CreateJournal;
