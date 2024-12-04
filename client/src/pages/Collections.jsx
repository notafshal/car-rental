import axios from "axios";
import { PiSeatbelt } from "react-icons/pi";
import NavBar from "../components/Navbar";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
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

  return (
    <div>
      <NavBar />

      <Card className="mx-5 bg-light">
        <h2 className="text-center my-3">Our Collections </h2>
        <Card.Body className="d-flex flex-row gap-4">
          {" "}
          {cars.map((data) => (
            <div key={data.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  {" "}
                  <Card.Title>
                    {data.carName} | {data.model} {data.make_year}
                  </Card.Title>
                  <Card.Text className="d-flex justify-content-between ">
                    <span>
                      <PiSeatbelt className="mx-2" />
                      {data.capacity} | {data.carType}
                    </span>
                    <span>{data.price_per_hour}/hour</span>
                  </Card.Text>
                  <Button variant="primary">Book Now</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Collections;
