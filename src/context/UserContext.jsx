import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [profile, setProfile] = useState(null);


  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/members/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data)); // Keep local storage in sync
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData(user.id);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, friends, setFriends, suggestions, setSuggestions, profile, setProfile, fetchUserData  }}>
      {children}
    </UserContext.Provider>
  );
};
