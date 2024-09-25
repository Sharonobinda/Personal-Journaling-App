import React from 'react';

const JournalList = ({ journals }) => {
  return (
    <div>
      <h2>Your Journal Entries</h2>
      <ul>
        {journals.map(journal => (
          <li key={journal.id}>
            <h3>{journal.title}</h3>
            <p>{journal.content}</p>
            <span>{journal.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalList;
