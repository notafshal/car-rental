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
const getSingleCar = async (req, res) => {
  try {
    const carId = req.params.id;

    if (!carId) {
      return res.status(404).send({
        message: "Invalid id",
      });
    }
    const rows = await dbPool.query(` SELECT * FROM cars WHERE id=${carId}`);
    if (!rows || rows.length === 0) {
      return res.status(404).send({ message: "No records found" });
    }
    res.status(200).send({
      message: "Getting single data success",
      data: rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ messge: "Error fetching ID" });
  }
};
const newCar = async (req, res) => {
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
      carType,
      TransmissionType,
      FuelType,
    } = req.body;
    if (
      !carName ||
      !model ||
      !make_year ||
      !capacity ||
      !air_condition === undefined ||
      !gps === undefined ||
      !child_seats === undefined ||
      !price_per_hour ||
      !price_per_day ||
      !price_per_week ||
      !carType ||
      !TransmissionType ||
      !FuelType
    ) {
      return res
        .status(404)
        .send({ messge: "Provide all neccessary car Details" });
    }
    const [result] = await dbPool.query(
      `INSERT INTO cars (carName,
      model,
      make_year,
      capacity,
      air_condition,
      gps,
      child_seats,
      price_per_hour,
      price_per_day,
      price_per_week,
      carType,
      TransmissionType,
      FuelType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
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
        carType,
        TransmissionType,
        FuelType,
      ]
    );
    if (!result || result.affectedRows === 0) {
      return res.status(500).send({ message: "Error in insert query" });
    }
    res.status(201).send({
      message: "New Car Added",
      userId: result.insertId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "New Car cannot be added", err });
  }
};
const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    if (!carId) {
      return res.status(404).send({
        message: "Invalid Id",
      });
    }

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
      carType,
      TransmissionType,
      FuelType,
    } = req.body;

    const [data] = await dbPool.query(
      `UPDATE cars SET
          carName = ?,
          model = ?,
          make_year = ?,
          capacity = ?,
          air_condition = ?,
          gps = ?,
          child_seats = ?,
          price_per_hour = ?,
          price_per_day = ?,
          price_per_week = ?,
          carType = ?,
          TransmissionType = ?,
          FuelType = ?
        WHERE id = ?`,
      [
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
        carType,
        TransmissionType,
        FuelType,
        carId, // Ensure that the carId is included to target the correct row
      ]
    );

    if (data.affectedRows === 0) {
      return res.status(404).send({
        message: "Car not found or no changes made",
      });
    }

    res.status(200).send({
      message: "Car details updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating car details",
      err,
    });
  }
};
const deleteCar = async (req, res) => {
  try {
    const carId = req.params.id;
    if (!carId) {
      return res.status(404).send({
        message: "Provide Valid carId",
      });
    }
    await dbPool.query(`DELETE FROM cars WHERE id=?`, [carId]);
    res.status(200).send({
      message: "car deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).sent({
      message: "Error In deleting user",
      err,
    });
  }
};

module.exports = { getCars, getSingleCar, newCar, updateCar, deleteCar };
