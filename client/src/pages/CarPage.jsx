import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { PiChairThin, PiSeatbelt } from "react-icons/pi";
import { FaCar, FaWind } from "react-icons/fa";
import { VscSourceControl } from "react-icons/vsc";
import { IoSpeedometer } from "react-icons/io5";
import { TbGps } from "react-icons/tb";
import Dropdown from "react-bootstrap/Dropdown";
import NavBar from "../components/Navbar";
import { UserContext } from "../context/UserContext";

const CarPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("hour");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: "",
    comment: "",
    user_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/cars/${id}`
        );
        const reviewsData = response.data.reviews || [];
        setCar(response.data.data);
        setReviews(reviewsData.filter((review) => review !== null));
        setLoadingReviews(false);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoadingReviews(false);
      }
    };

    fetchCarDetails();
  }, [id]);
  useEffect(() => {
    if (user && user.id) {
      setNewReview((prevReview) => ({
        ...prevReview,
        user_id: user.id,
      }));
    }
  }, [user]);
  const handlePriceSelection = (priceType) => {
    setSelectedPrice(priceType);
  };

  const renderPrice = () => {
    switch (selectedPrice) {
      case "hour":
        return car.price_per_hour;
      case "day":
        return car.price_per_day;
      case "week":
        return car.price_per_week;
      default:
        return car.price_per_hour;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const UserIdData = user.id;
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/cars/${id}/reviews`,
        newReview
      );
      setReviews((prev) => [...prev, response.data.review]);
      setShowReviewModal(false);
      setNewReview({ rating: "", comment: "", user_id: UserIdData });
      navigate("/collections");
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!car) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <Card>
              <Card.Body>
                <Carousel>
                  {car.photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={photo}
                        alt={`Car Image ${index + 1}`}
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <Card.Title className="d-flex justify-content-between mt-3">
                  <span>
                    {car.carName} {car.model}
                  </span>
                  <span>{car.make_year}</span>
                </Card.Title>
                <Card.Text className="row g-2">
                  <div className="d-flex flex-wrap gap-4 mt-3">
                    <span className="d-flex flex-column align-items-center">
                      <PiSeatbelt size={24} />
                      <small>{car.capacity} Seats</small>
                    </span>
                    <span className="d-flex flex-column align-items-center">
                      <FaCar size={24} />
                      <small>{car.carType}</small>
                    </span>
                    <span className="d-flex flex-column align-items-center">
                      <VscSourceControl size={24} />
                      <small>{car.TransmissionType}</small>
                    </span>
                    <span className="d-flex flex-column align-items-center">
                      <IoSpeedometer size={24} />
                      <small>{car.FuelType}</small>
                    </span>
                    <span
                      className="d-flex flex-column align-items-center"
                      style={{
                        color: car.air_condition === 0 ? "red" : "green",
                      }}
                    >
                      <FaWind size={24} />
                      <small>
                        {car.air_condition === 0 ? "No A/C" : "A/C"}
                      </small>
                    </span>
                    <span
                      className="d-flex flex-column align-items-center"
                      style={{
                        color: car.gps === 0 ? "red" : "green",
                      }}
                    >
                      <TbGps size={24} />
                      <small>{car.gps === 0 ? "NO GPS" : "GPS"}</small>
                    </span>
                    <span
                      className="d-flex flex-column align-items-center"
                      style={{
                        color: car.child_seats === 0 ? "red" : "green",
                      }}
                    >
                      <PiChairThin size={24} />
                      <small>
                        {car.child_seats === 0
                          ? " No Child seats"
                          : "Child seat"}
                      </small>
                    </span>
                  </div>

                  <div>
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Price ({selectedPrice})
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handlePriceSelection("hour")}
                        >
                          {car.price_per_hour}/hour
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handlePriceSelection("day")}
                        >
                          {car.price_per_day}/day
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handlePriceSelection("week")}
                        >
                          {car.price_per_week}/week
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className="mt-2">
                      <strong>Selected Price: {renderPrice()}</strong>
                    </div>
                  </div>
                </Card.Text>
                <div className="d-flex justify-content-center mt-3">
                  <Link
                    to={{
                      pathname: `/bookpage/${car.id}`,
                    }}
                  >
                    <Button
                      variant={car.availability === 1 ? "primary" : "danger"}
                      className="w-100"
                    >
                      Book Now
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-center">Reviews</h3>
          {loadingReviews ? (
            <Spinner
              animation="border"
              role="status"
              className="d-block mx-auto"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : reviews.length > 0 ? (
            <ListGroup>
              {reviews.map((review, index) => (
                <ListGroup.Item key={index}>
                  <strong>Rating:</strong> {review.rating} / 5
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-center">No reviews yet.</p>
          )}
          <div className="d-flex justify-content-center mt-3">
            <Button onClick={() => setShowReviewModal(true)}>Add Review</Button>
          </div>
        </div>
      </div>

      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-3" controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter a rating (1-5)"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit" disabled={loading} className="w-100">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CarPage;
