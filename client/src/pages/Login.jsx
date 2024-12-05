import { useContext, useState } from "react";
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/auth/login", { email, password })
      .then((result) => {
        setUser(result.data.data);
        setToastMessage("Login successful!");
        setShowToast(true);
        localStorage.setItem("key", result.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        navigate("/collections");
      })
      .catch((err) => {
        console.log(err);
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
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
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
              <button type="submit" className="btn btn-secondary w-100">
                Login
              </button>
            </form>
            <p className="mt-2">
              Do not have Account? <Link to="/register">Register now</Link>
            </p>
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

export default Login;
