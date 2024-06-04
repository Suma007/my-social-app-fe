import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import '../../styles/SignIn.css';

const SignIn = () => {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:3000/login';

  const handleLogin = (event) => {
    event.preventDefault();

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.logged_in) {
          setUser(data.member);
          localStorage.setItem('user', JSON.stringify(data.member));
          navigate('/home');
        } else {
          alert('Invalid name or password');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;