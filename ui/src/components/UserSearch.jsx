import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../services/users';
import { Card, Form, Button, Row, Col, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Search, PersonPlusFill } from 'react-bootstrap-icons';

const UserSearch = () => {
  // Search Filters State
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Data & UI State
  const [results, setResults] = useState([]);
  const [locations, setLocations] = useState({ cities: [], states: [] });
  const [friendshipStatus, setFriendshipStatus] = useState({ friends: [], pending: [] });
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

  // Fetch current user's ID and friendship statuses on mount
  useEffect(() => {
    const initialize = async () => {
      const userId = await getUserIdFromToken();
      if (userId) {
        setCurrentUserId(userId);
        fetchFriendshipStatuses(userId);
      }
    };
    initialize();
  }, []);

  // Fetch available cities and states for dropdowns
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const fetchFriendshipStatuses = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/friends/user_id=${userId}`, {
        params: { include_status: true },
      });
      const friends = response.data.friends || [];
      setFriendshipStatus({
        friends: friends.filter(f => f.status === 'accepted').map(f => f.friend_id),
        pending: friends.filter(f => f.status === 'pending').map(f => f.friend_id),
      });
    } catch (error) {
      console.error('Error fetching friendship statuses:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users/search', {
        params: { query, city, state, currentUserId },
      });
      setResults(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during search.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post(`http://localhost:5000/api/friends/user_id=${currentUserId}&friend_id=${friendId}`);
      // Optimistically update the UI for instant feedback
      setFriendshipStatus(prev => ({ ...prev, pending: [...prev.pending, friendId] }));
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Could not send friend request. Please try again.');
    }
  };
  
  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="text-center p-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!hasSearched) {
      return <div className="text-center text-muted p-4">Use the filters above to find new people.</div>;
    }

    if (results.length === 0) {
      return <div className="text-center text-muted p-4">No users found. Try adjusting your filters.</div>;
    }

    return (
      <ListGroup variant="flush">
        {results.map((user) => {
          const isFriend = friendshipStatus.friends.includes(user.user_id);
          const isPending = friendshipStatus.pending.includes(user.user_id);
          return (
            <ListGroup.Item key={user.user_id} className="d-flex align-items-center">
              {/* Avatar Placeholder */}
              <div className="avatar-placeholder me-3">
                {user.username.charAt(0).toUpperCase()}
              </div>
              {/* User Info */}
              <div className="flex-grow-1">
                <div className="fw-bold">{user.first_name} {user.last_name}</div>
                <small className="text-muted">{user.username} - {user.city}, {user.state}</small>
              </div>
              {/* Action Button */}
              <div>
                {isFriend ? (
                  <Button variant="success" size="sm" disabled>Friends</Button>
                ) : isPending ? (
                  <Button variant="warning" size="sm" disabled>Pending</Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => handleAddFriend(user.user_id)}>
                    <PersonPlusFill className="me-1" /> Add Friend
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Find New Friends</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Row className="g-2 align-items-center">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name, username, or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">All Cities</option>
                {locations.cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">All States</option>
                {locations.states.map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button type="submit" className="w-100" disabled={isLoading}>
                <Search className="me-1" /> Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
      <hr className="my-0" />
      {renderResults()}

      <style type="text/css">{`
        .avatar-placeholder {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
      `}</style>
    </Card>
  );
};

export default UserSearch;