import React, { createContext, useState } from 'react';

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => { // Change ProductProvider to JournalProvider
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [journals, setJournals] = useState([]);

  const fetchJournals = () => {
    console.log('Fetching journals for user...');
    fetch(`http://localhost:5000/journals`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the auth token to identify the user
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Network response was not ok: ${response.status} ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched journals:', data);
        setJournals(data); // Set fetched journals in the state
      })
      .catch((error) => console.error('Error fetching journals:', error));
  };
  
  const handleError = (response) => {
    return response.json().then((errorData) => {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData,
      });
      throw new Error(errorData.error || 'Unknown error');
    });
  };

  const createJournalEntry = (title, content, category) => {
    console.log('Creating journal:', { title, content, category });
    fetch(`http://127.0.0.1:5000/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ title, content, category }),
    })
      .then((response) => {
        if (!response.ok) {
          return handleError(response); // Handle error using your handleError function
        }
        return response.json();
      })
      .then((data) => {
        console.log('Journal created:', data);
        fetchJournals();
      })
      .catch((error) => console.error('Error creating journal:', error));
  };
  

  const updateJournalEntry = (journalId, updatedData) => {
    console.log(`Updating journal ID ${journalId}:`, updatedData);
    fetch(`http://127.0.0.1:5000/journal/${journalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          return handleError(response);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Journal updated:', data);
        fetchJournals();
      })
      .catch((error) => console.error('Error updating journal:', error));
  };

  const deleteJournalEntry = (journalId) => {
    console.log(`Deleting journal ID ${journalId}...`);
    fetch(`http://127.0.0.1:5000/journals/${journalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return handleError(response);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Journal deleted:', data);
        fetchJournals();
      })
      .catch((error) => console.error('Error deleting journal:', error));
  };

  return (
    <JournalContext.Provider value={{
      journals,
      authToken,
      setAuthToken,
      fetchJournals,
      createJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
    }}>
      {children}
    </JournalContext.Provider>
  );
};

