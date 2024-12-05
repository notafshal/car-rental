import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    carName: "",
    model: "",
    make_year: "",
    capacity: "",
    air_condition: false,
    gps: false,
    child_seats: false,
    price_per_hour: "",
    price_per_day: "",
    price_per_week: "",
    carType: "",
    TransmissionType: "",
    FuelType: "",
    images: [],
  });

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/cars");

      setCars(data.data);
    } catch (error) {
      console.error("Error fetching cars", error);
    }
  };

  const addCar = async () => {
    try {
      const formData = new FormData();

      for (const key in newCar) {
        if (key === "images") {
          newCar[key].forEach((image) => formData.append("images[]", image));
        } else if (
          key === "air_condition" ||
          key === "gps" ||
          key === "child_seats"
        ) {
          formData.append(key, newCar[key] ? 1 : 0);
        } else {
          formData.append(key, newCar[key]);
        }
      }
      const token = localStorage.getItem("key");
      await axios.post("http://localhost:8000/api/cars", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchCars();
      toast.success("Car added successfully!");
      setNewCar({
        carName: "",
        model: "",
        make_year: "",
        capacity: "",
        air_condition: false,
        gps: false,
        child_seats: false,
        price_per_hour: "",
        price_per_day: "",
        price_per_week: "",
        carType: "",
        TransmissionType: "",
        FuelType: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding car", error);
      toast.error("Failed to add car. Please try again.");
    }
  };

  const deleteCar = async (id) => {
    try {
      const token = localStorage.getItem("key"); // Retrieve the token
      if (!token) {
        toast.error("No token provided. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:8000/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      console.error("Error deleting car", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete car. Please try again.");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewCar({ ...newCar, images: files });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Car Management</h2>

      <div className="card shadow p-4 mb-5">
        <h4>Add a New Car</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Car Name"
              value={newCar.carName}
              onChange={(e) =>
                setNewCar({ ...newCar, carName: e.target.value })
              }
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Model"
              value={newCar.model}
              onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Make Year"
              value={newCar.make_year}
              onChange={(e) =>
                setNewCar({ ...newCar, make_year: e.target.value })
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Capacity"
              value={newCar.capacity}
              onChange={(e) =>
                setNewCar({ ...newCar, capacity: e.target.value })
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-control"
              value={newCar.carType}
              onChange={(e) =>
                setNewCar({ ...newCar, carType: e.target.value })
              }
            >
              <option value="">Car Type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-control"
              value={newCar.TransmissionType}
              onChange={(e) =>
                setNewCar({ ...newCar, TransmissionType: e.target.value })
              }
            >
              <option value="">Transmission Type</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-control"
              value={newCar.FuelType}
              onChange={(e) =>
                setNewCar({ ...newCar, FuelType: e.target.value })
              }
            >
              <option value="">Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Price Per Hour"
              value={newCar.price_per_hour}
              onChange={(e) =>
                setNewCar({ ...newCar, price_per_hour: e.target.value })
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Price Per Day"
              value={newCar.price_per_day}
              onChange={(e) =>
                setNewCar({ ...newCar, price_per_day: e.target.value })
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Price Per Week"
              value={newCar.price_per_week}
              onChange={(e) =>
                setNewCar({ ...newCar, price_per_week: e.target.value })
              }
            />
          </div>

          <div className="col-12 mb-3">
            <input
              type="file"
              className="form-control"
              multiple
              name="images[]"
              onChange={handleImageChange}
            />
            <small className="form-text text-muted">
              Choose up to 5 images.
            </small>
          </div>

          <div className="col-12">
            <button className="btn btn-primary w-100" onClick={addCar}>
              Add Car
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow p-4">
        <h4>Car Inventory</h4>
        <ul className="list-group">
          {cars.map((car) => (
            <li
              key={car.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{car.carName}</strong> - {car.model} ({car.make_year})
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteCar(car.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarManagement;
