import React , {useState, useEffect} from "react";
import { fetchUserById } from "../services/users";

const ProfileInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserData = async() => {
            try {
                const userData = await fetchUserById();
                if(userData) {
                    setUser(userData);
                }
                else {
                    setError("User not found");
                }
            } catch(error) {
                setError("Failed to fetch user data");
            }
            finally {
                setLoading(false);
            }
        };

        getUserData();   // Call the function to fetch data
    }, []);  // Empty dependency array ensures the effect runs once when the component mounts

    if (loading) {
        return <p>Loading...</p>;  // Show loading message while fetching data
      }
    
      if (error) {
        return <p>{error}</p>;  // Show error message if there's an issue
      }
    
      if (!user) {
        return <p>No user found</p>;  // Show message if no user data
      }

    return (
        <div className="profile-info">
      <h2>Profile Information</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Full Name:</strong> {user.name} {user.surname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
      {/* Add more fields as necessary */}
        </div>
    );
};

export default ProfileInfo;