import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    number: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        location: user.location || "",
        number: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("key")}`,
        },
      });

      const updatedUser = {
        id: user.id,
        name: formData.fullName,
        email: formData.email,
        phone: formData.number,
        location: formData.location,
      };
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setError("");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
      setSuccess("");
    }
  };

  if (!user) {
    return (
      <div>
        <NavBar />
        <div className="container mt-5 text-center">
          <p>Please log in to edit your profile.</p>
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
            <h3 className="text-center mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="card shadow-sm p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="number" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
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
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-secondary w-100">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
