import NavBar from "../components/Navbar";
import carImage from "../assets/front_car.jpg";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div>
      <NavBar />
      <div>
        <h1 className="text-center mt-4">Premium Car Rental Services</h1>
        <h6 className="text-center mt-4">
          Affordable and flexible car rentals for every journey. Choose from a
          wide range of vehicles for hassle-free travel experiences.
        </h6>
        <div className="card mt-4 mx-3 mx-md-5 p-4 bg-light">
          <div className="row">
            <div className="col-12 col-md-6">
              <h3>BOOK YOUR CAR TODAY</h3>
              <p>
                Our cars are the perfect choice for a seamless car rental
                experience, offering unmatched comfort, reliability, and style.
                Each vehicle in our fleet is meticulously maintained to ensure
                top performance, making every journey safe and enjoyable.
                Whether you need a compact car for city drives or a spacious SUV
                for long road trips, we have options tailored to your needs.
                With competitive pricing and flexible rental plans, we provide
                exceptional value for every customer. Experience the best in car
                rental services and make your travels truly hassle-free with us!
              </p>
              <Link to="/collections">
                <button type="button" className="btn btn-secondary">
                  View Collections{" "}
                  <TbArrowBadgeRightFilled className="font-xl" />
                </button>
              </Link>
            </div>
            <div className="col-12 col-md-6 mt-3 mt-md-0">
              <img src={carImage} alt="Car" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
