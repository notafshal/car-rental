const dbPool = require("../config/db");

const getCars = async (req, res) => {
  try {
    const [rows] = await dbPool.query(" SELECT * FROM cars");
    if (!rows || rows.length === 0) {
      return res.status(404).send({ message: "No records found" });
    }
    res.status(200).send({
      message: "All cars records",
      totalCars: rows.length,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error is getting data", err });
  }
};
const getSingeCar = (req, res) => {};
const newCar = (req, res) => {
  try {
    const {
      carName,
      model,
      make_year,
      capacity,
      air_condition,
      gps,
      child_seats,
      price_per_hour,
      price_per_day,
      price_per_week,
    } = req.body;
    if (
      !carName ||
      !model ||
      !make_year ||
      !capacity ||
      !air_condition ||
      !gps ||
      !child_seats ||
      !price_per_hour ||
      !price_per_day ||
      !price_per_week
    ) {
      return res
        .status(404)
        .send({ messge: "Provide all neccessary car Details" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "New Car cannot be added", err });
  }
};
const updateCar = (req, res) => {};
const deleteCar = (req, res) => {};

module.exports = { getCars, getSingeCar, newCar, updateCar, deleteCar };
