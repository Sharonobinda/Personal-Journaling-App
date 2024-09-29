import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [auth_token, setAuth_token] = useState(() =>
    localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [current-user, setCurrent-user] = useState(null);
  const [onChange, setOnChange] = useState(false);
  const nav = useNavigate();

  // Register user
  const register = (username, email, password, onSuccess) => {
    fetch(`http://127.0.0.1:5000/register`, {
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
    fetch(`http://127.0.0.1:5000/login`, {
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
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.error || 'Login failed');
        }
      })
      .catch((error) => {
        toast.error(`Login failed: ${error.message}`);
      });
  };

  // Update user profile
  const update_user = (username, password) => {
    fetch(`http://127.0.0.1:5000/update-profile`, {
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
          setCurrent-user((prevState) => ({
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
    fetch(`http://127.0.0.1:5000/logout`, {
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
          setCurrent-user(null);
          setOnChange(!onChange);
          toast.success(res.success);
          nav('/login');
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

  useEffect(() => {
    if (auth_token) {
      fetch(`http://127.0.0.1:5000/current-user`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth_token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.email) {
            setCurrent-user(res);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('access_token');
            setAuth_token(null);
            setIsAuthenticated(false);
            setCurrent-user(null);
            nav('/login');
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
    current-user,
    setCurrent-user,
    register,
    login,
    update_user,
    logout,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
