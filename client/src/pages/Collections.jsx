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
    fuelType: "",
    minPrice: "",
    maxPrice: "",
  });
  const navigate = useNavigate();

  // Fetch all cars on initial render
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/cars")
      .then((res) => setCars(res.data.data || []))
      .catch((err) => {
        console.error("Error fetching cars:", err);
      });
  }, []);

  // Handle filter input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle filter form submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(filters).toString();
    navigate(`/filtered-results?${query}`);
  };

  return (
    <div>
      <NavBar />

      {/* Filter Section */}
      <Card className="mx-5 bg-light">
        <h2 className="text-center my-3">Filter Cars</h2>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <div className="row g-3">
              {/* Car Type Filter */}
              <div className="col-md-3">
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
                    <option value="Hatchback">Hatchback</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Transmission Type Filter */}
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Transmission Type</Form.Label>
                  <Form.Select
                    name="TransmissionType"
                    value={filters.TransmissionType}
                    onChange={handleInputChange}
                  >
                    <option value="">All</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Fuel Type Filter */}
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="fuelType"
                    value={filters.fuelType}
                    onChange={handleInputChange}
                  >
                    <option value="">All</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Price Range Filter */}
              <div className="col-md-3">
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
              <Button type="submit" variant="primary">
                Apply Filters
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Car Collection Section */}
      <Card className="mx-5 bg-light mt-4">
        <h2 className="text-center my-3">Our Collections</h2>
        <Card.Body>
          <div className="row g-4">
            {cars.map((data) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={data.id}>
                <Card style={{ width: "100%" }}>
                  <Card.Img
                    variant="top"
                    src={data.photo_url || "/default-image.jpg"}
                    className="p-2 rounded"
                    alt="Car"
                  />
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                      <div>
                        {data.carName} | {data.model} | {data.make_year}
                      </div>
                      <div>
                        {data.price_per_hour}
                        <span className="text-secondary">/hour</span>
                      </div>
                    </Card.Title>
                    <Card.Text className="d-flex justify-content-between text-primary my-2">
                      <span className="d-flex flex-column">
                        <PiSeatbelt />
                        {data.capacity}
                      </span>
                      <span className="d-flex flex-column">
                        <FaCar />
                        {data.carType}
                      </span>
                      <span className="d-flex flex-column">
                        <VscSourceControl />
                        {data.TransmissionType}
                      </span>
                      <span className="d-flex flex-column">
                        <IoSpeedometer />
                        {data.fuelType}
                      </span>
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary">Book Now</Button>
                      <Link to={`/cars/${data.id}`}>
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default Collections;
