import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
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
                      src={`https://ui-avatars.com/api/?name=${user.name}&size=128`}
                      alt="User Avatar"
                      className="rounded-circle shadow"
                    />
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Name:</strong> {user.name}
                    </li>
                    <li className="list-group-item">
                      <strong>Email:</strong> {user.email}
                    </li>
                    <li className="list-group-item">
                      <strong>Phone:</strong> {user.phone || "Not Provided"}
                    </li>
                    <li className="list-group-item">
                      <strong>Location:</strong>{" "}
                      {user.location || "Not Provided"}
                    </li>
                  </ul>
                </div>
                <div className="card-footer text-center">
                  <Link to="/edit-profile">
                    <button className="btn btn-secondary">Edit Profile</button>
                  </Link>
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
