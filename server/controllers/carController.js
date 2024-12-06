const dbPool = require("../config/db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};
const upload = multer({ storage: storage, fileFilter });
const getCars = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`
      SELECT 
        c.*, 
        (SELECT cp.photo_url 
         FROM carPhotos cp 
         WHERE cp.car_id = c.id 
         LIMIT 1) AS photo_url 
      FROM cars c
    `);

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
    res.status(500).send({ message: "Error getting data", err });
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

    const [carRows] = await dbPool.query(
      `
      SELECT * FROM cars WHERE id = ?
    `,
      [carId]
    );

    if (!carRows || carRows.length === 0) {
      return res.status(404).send({ message: "No car found" });
    }

    const [photoRows] = await dbPool.query(
      `
      SELECT photo_url FROM carPhotos WHERE car_id = ?
    `,
      [carId]
    );

    const carData = {
      ...carRows[0],
      photos: photoRows.map((photo) => photo.photo_url),
    };

    res.status(200).send({
      message: "Getting single data success",
      data: carData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching car details", err });
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
      air_condition === undefined ||
      gps === undefined ||
      child_seats === undefined ||
      !price_per_hour ||
      !price_per_day ||
      !price_per_week ||
      !carType ||
      !TransmissionType ||
      !FuelType ||
      !req.files ||
      req.files.length === 0
    ) {
      return res
        .status(400)
        .send({ message: "Provide all necessary car details and images" });
    }

    const [carResult] = await dbPool.query(
      `INSERT INTO cars (carName, model, make_year, capacity, air_condition, gps, child_seats, price_per_hour, price_per_day, price_per_week, carType, TransmissionType, FuelType) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    if (carResult.affectedRows === 0) {
      return res.status(500).send({ message: "Error adding car" });
    }

    const carId = carResult.insertId;
    const photoPromises = req.files.map((file) => {
      const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;
      return dbPool.query(
        `INSERT INTO carphotos (car_id, photo_url) VALUES (?, ?)`,
        [carId, photoUrl]
      );
    });

    await Promise.all(photoPromises);

    res.status(201).send({ message: "New Car Added with Photos", carId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "New Car cannot be added", error: err });
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
        carId,
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

const filetringCar = async (req, res) => {
  const { carType, minPrice, maxPrice, TransmissionType, FuelType } = req.query;
  let query = "SELECT * FROM cars WHERE 1=1";
  const values = [];
  if (carType) {
    query += " AND carType = ?";
    values.push(carType);
  }
  if (TransmissionType) {
    query += " AND LOWER(TransmissionType) = ?";
    values.push(TransmissionType.toLowerCase());
  }
  if (FuelType) {
    query += " AND LOWER(FuelType) = ?";
    values.push(FuelType.toLowerCase());
  }
  if (minPrice) {
    query += " AND price_per_day >= ?";
    values.push(Number(minPrice));
  }
  if (maxPrice) {
    query += " AND price_per_day <= ?";
    values.push(Number(maxPrice));
  }
  try {
    const [rows] = await dbPool.execute(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No car found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching filtered cars:", error);
    res.status(500).json({ message: "Error fetching filtered cars", error });
  }
};

module.exports = {
  getCars,
  getSingleCar,
  newCar,
  updateCar,
  deleteCar,
  filetringCar,
  upload,
};
