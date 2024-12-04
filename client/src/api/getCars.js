import axios from "axios";

const getCars = () => {
  try {
    const response = axios.get("http://localhost:8000/api/cars");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getCars;
