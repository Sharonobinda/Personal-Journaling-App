import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalContext } from '../context/JournalContext';

const EditJournal = () => {
  const { id } = useParams(); // Get journal ID from the URL
  const { journals, updateJournalEntry } = useContext(JournalContext);
  const [journal, setJournal] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const selectedJournal = journals.find((journal) => journal.id === parseInt(id));
    if (selectedJournal) {
      setJournal(selectedJournal);
      setFormData({
        title: selectedJournal.title,
        content: selectedJournal.content,
        category: selectedJournal.category,
      });
    }
  }, [id, journals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateJournalEntry(id, formData);
    navigate('/journals'); // Redirect to the main journal list or wherever you'd like
  };

  if (!journal) return <p>Loading...</p>;

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block">Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block">Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditJournal;
