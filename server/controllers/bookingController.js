const dbPool = require("../config/db");

const bookCar = async (req, res) => {
  try {
    const {
      user_id,
      car_id,
      start_date,
      end_date,
      durationType,
      durationValue,
    } = req.body;

    if (!user_id || !car_id || !durationType || !durationValue) {
      return res.status(400).send({ message: "All fields are required" });
    }

    console.log("Request body:", req.body);

    const [availability] = await dbPool.query(
      `SELECT * FROM bookings 
      WHERE car_id = ? 
      AND status = 'confirmed' 
      AND (start_date <= ? AND end_date >= ?)`,
      [car_id, end_date || null, start_date || null]
    );
    console.log("Availability query result:", availability);

    const [carDetails] = await dbPool.query(
      `SELECT price_per_hour, price_per_day, price_per_week FROM cars WHERE id = ?`,
      [car_id]
    );
    console.log("Car details query result:", carDetails);

    if (carDetails.length === 0) {
      return res.status(404).send({ message: "Car not found" });
    }

    const { price_per_hour, price_per_day, price_per_week } = carDetails[0];

    let total_price = 0;
    switch (durationType) {
      case "hour":
        total_price = price_per_hour * durationValue;
        break;
      case "day":
        total_price = price_per_day * durationValue;
        break;
      case "week":
        total_price = price_per_week * durationValue;
        break;
      default:
        return res.status(400).send({ message: "Invalid duration type" });
    }

    const [result] = await dbPool.query(
      `INSERT INTO bookings (user_id, car_id, start_date, end_date, status, total_price) 
         VALUES (?, ?, ?, ?, 'confirmed', ?)`,
      [user_id, car_id, start_date, end_date, total_price]
    );

    if (result.affectedRows === 0) {
      return res.status(500).send({ message: "Failed to book the car" });
    }

    res.status(200).send({
      message: "Car booked successfully",
      data: {
        user_id,
        car_id,
        total_price,
        durationType,
        durationValue,
      },
    });
  } catch (err) {
    console.error("Error booking car:", err);
    res.status(500).send({ message: "Error booking car", error: err });
  }
};
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).send({ message: "Booking ID is required" });
    }

    const [existingBooking] = await dbPool.query(
      `SELECT * FROM bookings WHERE id = ?`,
      [bookingId]
    );

    if (existingBooking.length === 0) {
      return res.status(404).send({ message: "Booking not found" });
    }

    const [result] = await dbPool.query(`DELETE FROM bookings WHERE id = ?`, [
      bookingId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).send({ message: "Failed to delete booking" });
    }

    res.status(200).send({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting booking", error: err });
  }
};
const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const [bookings] = await dbPool.query(
      `SELECT * FROM bookings WHERE user_id = ?`,
      [userId]
    );

    if (bookings.length === 0) {
      return res
        .status(404)
        .send({ message: "No bookings found for this user" });
    }

    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error fetching bookings for user",
      error: err,
    });
  }
};
module.exports = {
  bookCar,
  deleteBooking,
  getBookingsByUser,
};
