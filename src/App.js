import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Home from './components/Home/Home';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';
import ProfileView from './components/Home/ProfileView';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={user ? <Navigate to="/home" /> : <SignIn />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUp />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/profile/:id" element={<ProfileView />} />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
