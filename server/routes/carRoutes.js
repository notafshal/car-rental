const express = require("express");
const {
  getCars,
  getSingeCar,
  newCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/:id", getSingeCar);
carRouter.post("/", newCar);
carRouter.put("/:id", updateCar);
carRouter.delete("/:id", deleteCar);
module.exports = carRouter;
