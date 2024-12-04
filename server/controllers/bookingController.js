const dbPool = require("../config/db");

const bookCar = async (req, res) => {
  try {
    const { user_id, car_id, start_date, end_date } = req.body;
    if (!user_id || !car_id || !start_date || !end_date) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const [availability] = await dbPool.query(
      `SELECT * FROM bookings 
         WHERE car_id = ? 
         AND status = 'confirmed' 
         AND (start_date <= ? AND end_date >= ?)`,
      [car_id, end_date, start_date]
    );
    if (availability.length > 0) {
      return res
        .status(400)
        .send({ message: "Car is already booked for these dates" });
    }
    const [carDetails] = await dbPool.query(
      `SELECT price_per_hour, price_per_day, price_per_week FROM cars WHERE id = ?`,
      [car_id]
    );
    if (carDetails.length === 0) {
      return res.status(404).send({ message: "Car not found" });
    }
    const { price_per_hour, price_per_day, price_per_week } = carDetails[0];
    const start = new Date(start_date);
    const end = new Date(end_date);
    const durationInHours = Math.ceil((end - start) / (1000 * 60 * 60));
    let total_price = 0;
    if (durationInHours >= 168) {
      const weeks = Math.floor(durationInHours / 168);
      const remainingHours = durationInHours % 168;

      total_price += weeks * price_per_week;

      if (remainingHours >= 24) {
        const days = Math.floor(remainingHours / 24);
        const remaining = remainingHours % 24;

        total_price += days * price_per_day + remaining * price_per_hour;
      } else {
        total_price += remainingHours * price_per_hour;
      }
    } else if (durationInHours >= 24) {
      const days = Math.floor(durationInHours / 24);
      const remainingHours = durationInHours % 24;

      total_price += days * price_per_day + remainingHours * price_per_hour;
    } else {
      total_price = durationInHours * price_per_hour;
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
      message: "Car booked",
      data: carDetails,
    });
  } catch (err) {
    console.error(err);
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
