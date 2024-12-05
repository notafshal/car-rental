import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";

const Profile = () => {
  const { user, setUser } = useContext(UserContext); // Renaming 'users' to 'user' for clarity
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    setUser(null); // Clear user context
    localStorage.removeItem("user"); // Remove user data from localStorage
    localStorage.removeItem("key"); // Remove user data from localStorage
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = user?.id;
        if (!userId) {
          setError("No user found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/users/${userId}`
        );
        setUserData(response.data.data.user); // Corrected to match the API response
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      <div>
        <NavBar />
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-sm">
                <div className="card-header bg-secondary text-white">
                  <h3 className="text-center mb-0">User Profile</h3>
                </div>
                <div className="card-body">
                  <div className="text-center mb-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${userData.fullName}&size=128`}
                      alt="User Avatar"
                      className="rounded-circle shadow"
                    />
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Name:</strong> {userData.fullName}
                    </li>
                    <li className="list-group-item">
                      <strong>Email:</strong> {userData.email}
                    </li>
                    <li className="list-group-item">
                      <strong>Phone:</strong> {userData.phone || "Not Provided"}
                    </li>
                    <li className="list-group-item">
                      <strong>Location:</strong>{" "}
                      {userData.location || "Not Provided"}
                    </li>
                  </ul>
                </div>
                <div className="card-footer text-center d-flex gap-2 justify-content-center">
                  <Link to="/edit-profile">
                    <button className="btn btn-secondary">Edit Profile</button>
                  </Link>
                  <Link to="/viewbooking">
                    <button className="btn btn-secondary">View Bookings</button>
                  </Link>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
