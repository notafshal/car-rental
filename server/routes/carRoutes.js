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
const checkAdmin = require("../middleware/checkAdmin");

const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/:id", getSingleCar);
carRouter.post("/", upload.array("images[]", 5), checkAdmin, newCar);
carRouter.put("/:id", checkAdmin, updateCar);
carRouter.delete("/:id", checkAdmin, deleteCar);
carRouter.post("/book", verifyToken, bookCar);
carRouter.delete("/book/:id", verifyToken, deleteBooking);
module.exports = carRouter;
