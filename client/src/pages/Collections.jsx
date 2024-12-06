/* eslint-disable no-unused-vars */
import axios from "axios";
import { PiSeatbelt } from "react-icons/pi";
import NavBar from "../components/Navbar";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { FaCar, FaEye } from "react-icons/fa";
import { VscSourceControl } from "react-icons/vsc";
import { IoSpeedometer } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

function Collections() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    carType: "",
    TransmissionType: "",
    FuelType: "",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/cars")
      .then((res) => {
        setCars(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setError("Failed to fetch cars. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const query = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value)
    ).toString();

    try {
      const res = await axios.get(
        `http://localhost:8000/api/cars/filters?${query}`
      );
      if (res.data.length === 0) {
        setError("No cars found matching your filters.");
        setCars([]);
      } else {
        setCars(res.data);
      }
    } catch (err) {
      console.error("Error fetching filtered cars:", err);
      setError("Failed to fetch filtered cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />

      <Card className="mx-4 my-3 bg-light shadow">
        <h2 className="text-center my-3">Filter Cars</h2>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <Form.Group>
                  <Form.Label>Car Type</Form.Label>
                  <Form.Select
                    name="carType"
                    value={filters.carType}
                    onChange={handleInputChange}
                  >
                    <option value="">All</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Jeep">Jeep</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <Form.Group>
                  <Form.Label>Transmission Type</Form.Label>
                  <Form.Select
                    name="TransmissionType"
                    value={filters.TransmissionType}
                    onChange={handleInputChange}
                  >
                    <option value="">All</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <Form.Group>
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="FuelType"
                    value={filters.FuelType}
                    onChange={handleInputChange}
                  >
                    <option value="">All</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <Form.Group>
                  <Form.Label>Price Range</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleInputChange}
                    />
                    <Form.Control
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleInputChange}
                      className="ms-2"
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <div className="text-end mt-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Loading..." : "Apply Filters"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mx-4 my-3 bg-light shadow">
        <h2 className="text-center my-3">Our Collections</h2>
        <Card.Body>
          {error ? (
            <p className="text-center text-danger">{error}</p>
          ) : loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="row g-4">
              {cars.map((car) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={car.id}>
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={car.photo_url || "/default-image.jpg"}
                      className="p-2 rounded"
                      alt="Car"
                    />
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between">
                        <span>{car.carName}</span>
                        <span>
                          {car.price_per_hour}
                          <small>/hour</small>
                        </span>
                      </Card.Title>
                      <Card.Text className="d-flex justify-content-between text-primary my-2">
                        <span className="d-flex flex-column text-center">
                          <PiSeatbelt />
                          {car.capacity}
                        </span>
                        <span className="d-flex flex-column text-center">
                          <FaCar />
                          {car.carType}
                        </span>
                        <span className="d-flex flex-column text-center">
                          <VscSourceControl />
                          {car.TransmissionType}
                        </span>
                        <span className="d-flex flex-column text-center">
                          <IoSpeedometer />
                          {car.FuelType}
                        </span>
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button variant="primary">Book Now</Button>
                        <Link to={`/cars/${car.id}`}>
                          <Button variant="secondary">
                            <FaEye /> View
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Collections;
