import React, { useState } from 'react';
import axios from 'axios';

const UserSearch = ({ onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Search query cannot be empty.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/users/search`, {
        params: { query },
      });
      setResults(response.data.users);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during search.');
      setResults([]);
    }
  };

  return (
    <div className="mb-4">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {results.map((user) => (
          <li
            key={user.user_id}
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={() => onSelectUser(user)}
            style={{ cursor: 'pointer' }}
          >
            <span>
              <strong>{user.username}</strong> - {user.email} - {user.first_name} - {user.last_name} - {user.city}
            </span>
            <button className="btn btn-sm btn-secondary">Select</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
