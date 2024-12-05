import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import NavBar from "../components/Navbar";

const Profile = () => {
  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }
  return (
    <>
      <div>
        <NavBar />
        <h1>Welcome, {user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>User ID: {user.id}</p>
      </div>
    </>
  );
};
export default Profile;
