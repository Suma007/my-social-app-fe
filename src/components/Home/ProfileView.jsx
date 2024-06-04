import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Home.css';
import renderHeadings from '../utility/headingUtils';
import { UserContext } from '../../context/UserContext';

const ProfileView = () => {
  const { id } = useParams();
  const { profile, setProfile, setUser, user, setFriends, friends, fetchUserData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(true); // Show by default
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:3000/members';

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch member details');
      }
      const data = await response.json();
      setProfile(data);
      setLoading(false);
      const isFriend = data.friends.some((friend) => friend.id === parseInt(user.id));
      setShowButton(!isFriend);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, setProfile, friends]);

  const addFriend = () => {
    fetch(`${apiUrl}/${user.id}/add_friend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friend_id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
        fetchUserData(user.id);
        fetchProfile();
      })
      .catch((error) => setError(error.message));
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/SignIn');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-container container-fluid">
      <div className="header row">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h2>Welcome to profile of {profile?.name}</h2>
          <div className="d-flex">
            <button onClick={handleHome} className="btn btn-info home-btn mr-2">
              Go Home
            </button>
            <div>
              <button onClick={handleLogout} className="btn btn-danger logout-btn">
                Logout
              </button>
              {showButton && (
                <button onClick={addFriend} className="btn btn-success addfriend-btn ml-2">
                  Add Friend
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="main-content row">
        <div className="details col-md-3 gradient-bg">
          <h3>Member Details</h3>
          <p>
            <strong>Name:</strong> {profile?.name}
          </p>
          <p>
            <strong>Website: </strong>
            {profile?.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                {profile.website_url}
              </a>
            )}
          </p>
          <div className="tags">{renderHeadings(profile?.headings)}</div>
        </div>
        <div className="friends col-md-4 gradient-bg">
          <h3>Friends</h3>
          {profile?.friends.map((friend, index) => (
            <div key={index} className="friend-box">
              <p>{friend.name}</p>
              <div className="tags">{renderHeadings(friend.headings)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
