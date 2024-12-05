import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";

const BookPage = () => {
  const { user } = useContext(UserContext);
  const { id: carId } = useParams();
  const [durationType, setDurationType] = useState("hour");
  const [durationValue, setDurationValue] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You need to log in to book a car.");
      return;
    }
    const token = localStorage.getItem("key");

    const bookingData = {
      user_id: user.id,
      car_id: carId,
      start_date: startDate || null, // Optional based on durationType
      end_date: endDate || null, // Optional based on durationType
      durationType,
      durationValue,
    };

    try {
      await axios.post("http://localhost:8000/api/cars/book", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      setSuccess("Car booked successfully!");
      setError("");
      setTimeout(() => navigate("/collections"), 2000); // Redirect after success
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to book the car.");
      setSuccess("");
    }
  };

  if (!user) {
    return (
      <div>
        <NavBar />
        <div className="container mt-5 text-center">
          <p>Please log in to book a car.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h3 className="text-center mb-4">Book a Car</h3>
            <form onSubmit={handleSubmit} className="card shadow-sm p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="mb-3">
                <label htmlFor="durationType" className="form-label">
                  Booking Type
                </label>
                <select
                  id="durationType"
                  className="form-select"
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                  required
                >
                  <option value="hour">Hourly</option>
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="durationValue" className="form-label">
                  Number of {durationType}s
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="durationValue"
                  value={durationValue}
                  min={1}
                  onChange={(e) => setDurationValue(Number(e.target.value))}
                  required
                />
              </div>

              {["day", "week"].includes(durationType) && (
                <>
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required={durationType !== "hour"}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required={durationType !== "hour"}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-secondary w-100">
                Book Car
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
