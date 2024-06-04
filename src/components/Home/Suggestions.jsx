import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';

const Suggestions = () => {
  const { suggestions } = useContext(UserContext);

  return (
    <div>
      <h2>Suggestions</h2>
      <ul>
        {suggestions.map((item, index) => (
          <li key={index}>
            
            <Link to={`/profile/${item.member.id}`}>{item.member.name}</Link>
            {item.shortest_path && (
              <div>
                <strong>Shortest Path:</strong>
                <ul>
                  {item.shortest_path.map((connection, subIndex) => (
                    <li key={subIndex}>
                      <strong>Name:</strong> {connection.name}<br />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
