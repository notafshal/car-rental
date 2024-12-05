const dbPool = require("../config/db");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const [rows] = await dbPool.query(" SELECT * FROM users");
    if (!rows || rows.length === 0) {
      return res.status(404).send({ message: "No records found" });
    }

    res.status(200).send({
      message: "All user records",
      totalUsers: rows.length,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: " Error in getting userData" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.status(400).send({
        message: "Invalid ID",
      });
    }

    const [userRows] = await dbPool.query(`SELECT * FROM users WHERE id = ?`, [
      userID,
    ]);

    if (!userRows || userRows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const [bookingRows] = await dbPool.query(
      `SELECT b.*, c.carName AS car_name, c.model AS car_model
       FROM bookings b
       LEFT JOIN cars c ON b.car_id = c.id
       WHERE b.user_id = ?`,
      [userID]
    );

    res.status(200).send({
      message: "User data and booking history retrieved successfully",
      data: {
        user: userRows[0],
        bookings: bookingRows,
      },
    });
  } catch (err) {
    console.error("Error fetching user and bookings:", err.message || err);
    res.status(500).send({
      message: "Error fetching user and bookings",
      error: err?.message || JSON.stringify(err),
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, location, number } = req.body;

    if (!fullName || !email || !location || !number || !password) {
      return res.status(400).send({ message: "Provide all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await dbPool.query(
      `INSERT INTO users (fullName, email, password, location, number) 
         VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, hashedPassword, location, number]
    );

    if (!result || result.affectedRows === 0) {
      return res.status(500).send({ message: "Error in insert query" });
    }

    res.status(201).send({
      message: "New User Added",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error creating user", error: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    if (!userId) {
      return res.status(404).send({
        message: "Invalid Id",
      });
    }
    const { fullName, email, location, number } = req.body;

    const [data] = await dbPool.query(
      `UPDATE users SET fullName = ?, email = ?, location = ?, number = ? WHERE id = ?`,
      [fullName, email, location, number, userId]
    );

    if (data.affectedRows === 0) {
      return res.status(404).send({
        message: "User not found or no changes made",
      });
    }

    res.status(200).send({
      message: "User details updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error Updating User",
      err,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).send({
        message: "Provide Valid UserId",
      });
    }
    await dbPool.query(`DELETE FROM users WHERE id=?`, [userId]);
    res.status(200).send({
      message: "user deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).sent({
      message: "Error In deleting user",
      err,
    });
  }
};
module.exports = {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
};
