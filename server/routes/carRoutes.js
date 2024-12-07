const express = require("express");
const {
  getCars,
  getSingleCar,
  newCar,
  updateCar,
  deleteCar,
  filetringCar,
  postReviews,

  upload,
} = require("../controllers/carController");
const { bookCar, deleteBooking } = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

const carRouter = express.Router();

carRouter.get("/filters", filetringCar);
carRouter.get("/", getCars);
carRouter.post("/", upload.array("images[]", 5), newCar);
carRouter.post("/book", verifyToken, bookCar);
carRouter.get("/:id", getSingleCar);
carRouter.put("/:id", updateCar);
carRouter.delete("/:id", deleteCar);
carRouter.delete("/book/:id", verifyToken, deleteBooking);
carRouter.post("/:id/reviews", postReviews);
module.exports = carRouter;
