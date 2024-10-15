import React, { createContext, useState } from 'react';
import {server_url} from "../../config"

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => { // Change ProductProvider to JournalProvider
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [journals, setJournals] = useState([]);

  const fetchJournals = () => {
    console.log('Fetching journals for user...');
    fetch(`${server_url}/journals`, {
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
    fetch(`${server_url}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // The token is included for authentication
      },
      body: JSON.stringify({ 
        title, 
        content, 
        category 
      }), // Ensure that the keys match what the backend expects
    })
    .then(response => {
      if (!response.ok) {
        return handleError(response); // Handle errors if response is not ok
      }
      return response.json();
    })
    .then(data => {
      console.log('Journal created:', data);
      fetchJournals(); // Re-fetch the journals after a new one is created
    })
    .catch(error => console.error('Error creating journal:', error));
  };
  
  
  const updateJournalEntry = (journalId, updatedData) => {
    console.log(`Updating journal ID ${journalId}:`, updatedData);
    fetch(`${server_url}/journal/${journalId}`, {
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
    fetch(`${server_url}/journals/${journalId}`, {
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

