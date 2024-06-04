import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import '../../styles/SignUp.css';

const SignUp = () => {
  const apiUrl = "http://localhost:3000/members";
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSignUp = (event) => {
    event.preventDefault();

    const newUser = { name, website_url: websiteUrl, password, password_confirmation: passwordConfirmation };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser)
    })
      .then((response) => response.json())
      .then(data => {
        if (data) {
          console.log(data);
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
          navigate('/signin');
        } else {
          console.error('Failed to sign up:');
        }
      })
      .catch(error => {
        console.error('Error signing up:', error);
      });
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Profile Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
