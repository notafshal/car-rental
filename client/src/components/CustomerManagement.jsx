import { useEffect, useState } from "react";
import axios from "axios";
import UserDetails from "./UserDetails";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/users");
      setCustomers(data.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (selectedUserId) {
    return (
      <UserDetails
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Customer Management</h2>
      <div className="row">
        {customers.map((customer) => (
          <div key={customer.id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card shadow-sm h-100"
              onClick={() => setSelectedUserId(customer.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <h5 className="card-title">{customer.fullName}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {customer.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;
