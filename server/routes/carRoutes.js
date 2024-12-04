const express = require("express");
const {
  getCars,
  getSingleCar,
  newCar,
  updateCar,
  deleteCar,
  upload,
} = require("../controllers/carController");
const { bookCar, deleteBooking } = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/:id", getSingleCar);
carRouter.post("/", upload.array("images", 5), newCar);
carRouter.put("/:id", updateCar);
carRouter.delete("/:id", deleteCar);
carRouter.post("/book", verifyToken, bookCar);
carRouter.delete("/book/:id", deleteBooking);
module.exports = carRouter;
