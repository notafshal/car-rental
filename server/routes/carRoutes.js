const express = require("express");
const {
  getCars,
  getSingleCar,
  newCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { bookCar, deleteBooking } = require("../controllers/bookingController");

const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/:id", getSingleCar);
carRouter.post("/", newCar);
carRouter.put("/:id", updateCar);
carRouter.delete("/:id", deleteCar);
carRouter.post("/book", bookCar);
carRouter.delete("/book/:id", deleteBooking);
module.exports = carRouter;
