import React, { useState } from 'react';

const CreateJournal = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Personal');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to submit the journal entry
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Journal</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
      </select>
      <textarea
        placeholder="Journal Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateJournal;