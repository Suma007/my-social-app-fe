import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Home.css';
import renderHeadings from '../utility/headingUtils';
import Suggestions from './Suggestions';

const Home = () => {
  const { user, setUser, setSuggestions } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const apiUrl = user ? `http://localhost:3000/members/${user.id}/find_people_you_may_know` : null;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!apiUrl) return;
      setLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSuggestions();
    }
  }, [user, apiUrl, setSuggestions]);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/members');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(term.length > 0);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/SignIn');
  };

  const handleMemberProfileClick = (memberId) => {
    navigate(`/profile/${memberId}`);
  };

  const filteredResults = members.filter((member) => {
    if (!searchTerm) return true; // If no search term, show all members
    return member.headings.some((heading) => heading.content_value.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
          <h2>Welcome, {user?.name}</h2>
          <div>
            <button onClick={handleLogout} className="btn btn-danger logout-btn">
              Logout
            </button>
          </div>
        </div>
        <div className="col-12">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {showDropdown && (
              <div className="dropdown">
                {filteredResults.map((member, index) => (
                  <div key={index} onClick={() => handleMemberProfileClick(member.id)}>
                    <p>{member.name}</p>
                    <div>
                      {member.headings.map((heading, idx) => (
                        <span key={idx}>{heading.content_value}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="main-content row">
        <div className="details col-md-3 gradient-bg">
          <h3>Your Details</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p>
            <strong>Website: </strong>
            {user?.website_url && (
              <a href={user.website_url} target="_blank" rel="noopener noreferrer">
                {user.website_url}
              </a>
            )}
          </p>
          <div className="tags">{renderHeadings(user?.headings)}</div>
        </div>
        <div className="friends col-md-4 gradient-bg">
          <h3>Friends</h3>
          {user?.friends?.map((friend, index) => (
            <div key={index} className="friend-box">
              <p>{friend.name}</p>
              <div className="tags">{renderHeadings(friend.headings)}</div>
            </div>
          ))}
        </div>
        <div className="suggestions col-md-4 gradient-bg">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Home;
