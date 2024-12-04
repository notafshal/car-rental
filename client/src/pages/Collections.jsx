import axios from "axios";
import { PiSeatbelt } from "react-icons/pi";
import NavBar from "../components/Navbar";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaCar, FaEye } from "react-icons/fa";
import { VscSourceControl } from "react-icons/vsc";
import { IoSpeedometer } from "react-icons/io5";
import { Link } from "react-router-dom";
function Collections() {
  const [cars, setCars] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/cars")
      .then((res) => setCars(res.data.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(cars.map((data) => data.photo_url));
  return (
    <div>
      <NavBar />

      <Card className="mx-5 bg-light">
        <h2 className="text-center my-3">Our Collections</h2>
        <Card.Body>
          <div className="row g-4">
            {cars.map((data) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={data.id}>
                <Card style={{ width: "100%" }}>
                  <Card.Img
                    variant="top"
                    src={data.photo_url ? data.photo_url : "/default-image.jpg"}
                    className="p-2 rounded"
                    alt="image"
                  />
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                      <div>
                        {data.carName} | {data.model} | {data.make_year} |
                      </div>{" "}
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
                        {data.FuelType}
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
