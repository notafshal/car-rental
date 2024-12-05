/* eslint-disable react/prop-types */
const AdminSidebar = ({ setActiveComponent }) => {
  return (
    <div
      className="bg-secondary text-white p-3 vh-100"
      style={{ minWidth: "200px" }}
    >
      <h4>Admin Panel</h4>
      <nav className="nav flex-column">
        <button
          className="btn btn-link nav-link text-white text-start"
          onClick={() => setActiveComponent("CarManagement")}
        >
          Car Management
        </button>
        <button
          className="btn btn-link nav-link text-white text-start"
          onClick={() => setActiveComponent("CustomerManagement")}
        >
          Customer Management
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
