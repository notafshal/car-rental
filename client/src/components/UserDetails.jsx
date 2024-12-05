/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";

const UserDetails = ({ userId, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/users/${userId}`
      );

      setUserData(data.data.user);
      setBookingData(data.data.bookings);
    } catch (error) {
      console.error("Error fetching user details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!userData) {
    return (
      <div className="text-center">
        <p>Error loading user details.</p>
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>
        Back to Customers
      </button>
      <h3 className="mb-4">User Details</h3>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">User Information</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Name:</strong> {userData.fullName}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {userData.email}
            </li>
            <li className="list-group-item">
              <strong>Location:</strong> {userData.location}
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> {userData.number}
            </li>
            <li className="list-group-item">
              <strong>Admin:</strong> {userData.isAdmin ? "Yes" : "No"}
            </li>
            <li className="list-group-item">
              <strong>Account Created:</strong>{" "}
              {new Date(userData.created_at).toLocaleDateString()}
            </li>
          </ul>
        </div>
      </div>

      <h4>Booking History</h4>
      {bookingData.length > 0 ? (
        <div className="row">
          {bookingData.map((booking) => (
            <div key={booking.id} className="col-md-6">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">
                    {booking.car_name} ({booking.car_model})
                  </h5>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(booking.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${booking.total_price}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        booking.status === "confirmed"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No booking history found for this user.</p>
      )}
    </div>
  );
};

export default UserDetails;
