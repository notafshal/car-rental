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
      return res.status(400).json({ message: "Invalid car ID provided" });
    }

    const [carRows] = await dbPool.query(
      `
      SELECT * FROM cars WHERE id = ?
      `,
      [carId]
    );

    if (!carRows || carRows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    const [reviews] = await dbPool.query(
      `
      SELECT r.rating, r.comment, u.username 
      FROM reviews r 
      INNER JOIN users u ON r.user_id = u.id 
      WHERE r.car_id = ?
      ORDER BY r.created_at DESC
      `,
      [carId]
    );

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

    res.status(200).json({
      message: "Car details fetched successfully",
      data: carData,
      reviews: reviews || [],
    });
  } catch (error) {
    console.error("Error fetching car details:", error);
    res.status(500).json({ message: "Error fetching car details", error });
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
  let query = `
    SELECT c.*, 
      (SELECT cp.photo_url 
       FROM carPhotos cp 
       WHERE cp.car_id = c.id 
       LIMIT 1) AS photo_url 
    FROM cars c WHERE 1=1
  `;
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

const postReviews = async (req, res) => {
  const { id: carId } = req.params;
  const { user_id, rating, comment } = req.body;
  if (!rating || !comment || !user_id) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const [user] = await dbPool.query("SELECT id FROM users WHERE id = ?", [
      user_id,
    ]);
    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    const [result] = await dbPool.query(
      `
      INSERT INTO reviews (car_id, user_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [carId, user_id, rating, comment]
    );
    if (result.affectedRows > 0) {
      return res
        .status(201)
        .json({ message: "Review submitted successfully!" });
    } else {
      return res.status(500).json({ message: "Failed to submit review." });
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review.", error });
  }
};

module.exports = {
  getCars,
  getSingleCar,
  newCar,
  updateCar,
  deleteCar,
  filetringCar,
  postReviews,
  upload,
};
