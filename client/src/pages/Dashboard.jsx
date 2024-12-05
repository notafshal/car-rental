import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

import CarManagement from "../components/CarManagement";
import CustomerManagement from "../components/CustomerManagement";
import NavBar from "../components/Navbar";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("CarManagement");

  const renderComponent = () => {
    switch (activeComponent) {
      case "CarManagement":
        return <CarManagement />;
      case "CustomerManagement":
        return <CustomerManagement />;

      default:
        return <CarManagement />;
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />
      <div className="flex-grow-1 p-4">
        <NavBar />
        <div className="container">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
