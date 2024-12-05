import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function NavBar() {
  const isLoggedIn = localStorage.getItem("key");
  const { user } = useContext(UserContext);

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
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-secondary">
              <CiSearch />
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
