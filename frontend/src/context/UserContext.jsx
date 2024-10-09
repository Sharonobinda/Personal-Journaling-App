import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {server_url} from "../../config"

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [auth_token, setAuth_token] = useState(() =>
    localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [onChange, setOnChange] = useState(false);
  const nav = useNavigate();

  // Fetch journals after login
  const fetchJournals = () => {
    fetch('${server_url}/journals', {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.journals) {
          // Handle the fetched journals data
          toast.success('Journals fetched successfully');
          // You might want to set journals in state here, depending on your application.
        }
      })
      .catch((error) => {
        toast.error(`Error fetching journals: ${error.message}`);
      });
  };

  // Register user
  const register = (username, email, password, onSuccess) => {
    fetch(`${server_url}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then((res) => {
        if (res.message) {
          toast.success(res.message);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.error || 'Registration failed');
        }
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message}`);
      });
  };

  // Login user
  const login = (email, password, onSuccess) => {
    fetch(`${server_url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then((res) => {
        if (res.access_token) {
          localStorage.setItem('access_token', res.access_token);
          setAuth_token(res.access_token);
          setIsAuthenticated(true);
          toast.success('Logged in successfully');
          fetchJournals(); // Fetch journals after successful login
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.error || 'Login failed');
        }
      })
      .catch((error) => {
        toast.error(`Login failed: ${error.message}`);
      });
  };

  // Fetch user profile details when authenticated
  useEffect(() => {
    if (auth_token) {
      fetch('${server_url}/profile', {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrentUser(data.user); // Assuming the response contains user data
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          localStorage.removeItem('access_token');
        });
    }
  }, [auth_token]);

  // Update user profile
  const updateUser = (username, password) => {
    fetch(`${server_url}/update-profile`, {
      method: 'PUT',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.success);
          setCurrentUser((prevState) => ({
            ...prevState,
            username,
            password,
          }));
        } else if (res.error) {
          toast.error(res.error);
        } else {
          toast.error('An error occurred');
        }
      })
      .catch((error) => {
        toast.error(`Update failed: ${error.message}`);
      });
  };

  // Logout function
  const logout = () => {
    fetch(`${server_url}/logout`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          localStorage.removeItem('access_token');
          setAuth_token(null);
          setIsAuthenticated(false);
          setCurrentUser(null);
          setOnChange(!onChange);
          toast.success(res.success);
          nav('/');
        } else if (res.error) {
          toast.error(res.error);
        } else {
          toast.error('An error occurred');
        }
      })
      .catch((error) => {
        toast.error(`Logout failed: ${error.message}`);
      });
  };

  // Fetch current user when auth_token changes
  useEffect(() => {
    if (auth_token) {
      fetch(`${server_url}/current-user`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth_token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.email) {
            setCurrentUser(res);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('access_token');
            setAuth_token(null);
            setIsAuthenticated(false);
            setCurrentUser(null);
            nav('/');
          }
        })
        .catch((error) => {
          toast.error(`Fetching current user failed: ${error.message}`);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [auth_token, onChange, nav]);

  const contextData = {
    auth_token,
    currentUser,
    setCurrentUser,
    register,
    login,
    updateUser,
    logout,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
