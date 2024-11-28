import React, { useState, useEffect } from "react";
import { fetchUserById } from "../services/users";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserById();
        if (userData) {
          setUser(userData);
        } else {
          setError("User not found");
        }
      } catch (error) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    getUserData(); // Call the function to fetch data
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-3" role="alert">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center mt-3" role="alert">
        No user found.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2>Profile Information</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Username:</strong> {user.username}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>First Name:</strong> {user.first_name}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Last Name:</strong> {user.last_name}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Address:</strong> {user.address || "N/A"}</p>
            </div>
            <div className="col-md-6">
              <p><strong>City:</strong> {user.city || "N/A"}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>State:</strong> {user.state || "N/A"}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Phone Number:</strong> {user.phone_number || "N/A"}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
