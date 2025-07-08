import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Card, ListGroup } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import UserSearch from '../components/UserSearch';
import FriendComponent from './../components/FriendComponent';
import { getFriendsFromCurrentUser, getPendingRequests } from '../services/friends';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);

  const fetchFriends = async () => {
    const friendsData = await getFriendsFromCurrentUser();
    if (Array.isArray(friendsData)) {
      setFriends(friendsData);
    }
  };

  const fetchPendingRequests = async () => {
    const pendingFriendsData = await getPendingRequests();
    if (Array.isArray(pendingFriendsData)) {
      setPendingFriends(pendingFriendsData);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  const onFriendsChange = () => {
    fetchFriends();
    fetchPendingRequests();
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        {/* User Search Component takes the full width */}
        <Row className="mb-4">
          <Col>
            <UserSearch />
          </Col>
        </Row>

        <Row>
          {/* My Friends Section */}
          <Col md={8}>
            <h3 className="mb-3">My Friends</h3>
            <Row>
              {friends.length === 0 ? (
                <Col>
                  <p className="text-muted">You haven't added any friends yet.</p>
                </Col>
              ) : (
                friends.map(friendId => (
                  <Col md={4} key={friendId} className="mb-3">
                    <FriendComponent
                      friendId={friendId}
                      status={'accepted'}
                      onFriendsChange={onFriendsChange}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Col>

          {/* Pending Requests Section */}
          <Col md={4}>
            <Card>
              <Card.Header as="h5">Pending Requests</Card.Header>
              <ListGroup variant="flush">
                {pendingFriends.length === 0 ? (
                  <ListGroup.Item className="text-muted text-center">
                    No pending requests.
                  </ListGroup.Item>
                ) : (
                  pendingFriends.map(pendingFriend => (
                    <ListGroup.Item key={pendingFriend.initiator_id}>
                      <FriendComponent
                        friendId={pendingFriend.initiator_id}
                        status={'pending'}
                        onFriendsChange={onFriendsChange}
                      />
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Friends;