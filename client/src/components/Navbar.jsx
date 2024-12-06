import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function NavBar() {
  const isLoggedIn = localStorage.getItem("key");
  const { user } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/cars")
      .then((response) => {
        setCars(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() !== "") {
      const results = cars.filter((car) =>
        car.carName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCars(results);
    } else {
      setFilteredCars([]);
    }
  };

  const handleCarClick = (id) => {
    navigate(`/cars/${id}`);
    setSearchQuery("");
    setFilteredCars([]);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">Key2Drive</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/" className="nav-link">
              Home
            </Link>

            {isLoggedIn ? (
              <Link to="/profile" className="nav-link">
                <span>Account</span>
              </Link>
            ) : (
              <Link to="/login" className="nav-link">
                <span>Login</span>
              </Link>
            )}

            <Link to="/collections" className="nav-link">
              Collections
            </Link>

            {user && user.isAdmin === 1 && (
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            )}
          </Nav>

          <Form className="d-flex position-relative">
            <Form.Control
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for cars..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-secondary">
              <CiSearch />
            </Button>

            {searchQuery && filteredCars.length > 0 && (
              <div className="search-results position-absolute bg-white border mt-2 w-100">
                <ul className="list-unstyled m-0">
                  {filteredCars.map((car) => (
                    <li
                      key={car.id}
                      className="p-2 border-bottom hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCarClick(car.id)}
                    >
                      {car.carName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {searchQuery && filteredCars.length === 0 && (
              <div className="position-absolute bg-white border mt-2 w-100 p-2">
                No cars found.
              </div>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
