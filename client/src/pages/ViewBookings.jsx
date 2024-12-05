import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";

const ViewBookings = () => {
  const { user: contextUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = contextUser?.id;
        if (!userId) {
          setError("User not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/users/${userId}`
        );
        console.log(response.data.data.bookings);
        setBookings(response.data.data.bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [contextUser]);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Bookings</h2>
        {bookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Car Name</th>
                  <th>Car Model</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{index + 1}</td>
                    <td>{booking.car_name || "N/A"}</td>
                    <td>{booking.car_model || "N/A"}</td>
                    <td>{booking.start_date}</td>
                    <td>{booking.end_date}</td>
                    <td>{`${booking.total_price}`}</td>
                    <td>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p>No bookings found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewBookings;
