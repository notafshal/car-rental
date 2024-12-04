import axios from "axios";

const getSingleCars = (carId) => {
  try {
    const response = axios.get(`http://localhost:8000/api/cars/${carId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export default getSingleCars;
