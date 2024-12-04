import { useState } from "react";
import NavBar from "../components/Navbar";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [number, setNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/users", {
        fullName,
        email,
        password,
        location,
        number,
      })
      .then((result) => {
        console.log(result);
        setToastMessage("Registration successful!");
        setShowToast(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setLocation("");
        setNumber("");
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      })
      .catch((err) => {
        setToastMessage(err.response?.data?.message || "Registration failed!");
        setShowToast(true);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <h3 className="text-center mb-4">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="number" className="form-label">
                  Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="number"
                  placeholder="Enter your phone number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary w-100">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1050,
        }}
        bg={toastMessage.includes("successful") ? "success" : "danger"}
        autohide
        delay={3000}
      >
        <Toast.Header>
          <strong className="me-auto">
            {toastMessage.includes("successful") ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Register;
