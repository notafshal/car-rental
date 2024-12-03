const dbPool = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const [rows] = await dbPool.query(" SELECT * FROM users");
    if (!rows || rows.length === 0) {
      return res.status(404).send({ message: "No records found" });
    }

    res.status(200).send({
      message: "All user recordAs",
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
      return res.status(404).send({
        message: "Invalid ID",
      });
    }
    const rows = await dbPool.query(` SELECT * FROM users WHERE id=${userID}`);
    if (!rows || rows.length === 0) {
      return res.status(404).send({ message: "No records found" });
    }
    res.status(200).send({
      message: "Getting single data success",
      data: rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "No user found", err });
  }
};
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, location, number, isAdmin } = req.body;

    if (
      !fullName ||
      !email ||
      !location ||
      !number ||
      !password ||
      isAdmin === undefined
    ) {
      return res.status(400).send({ message: "Provide all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    const [result] = await dbPool.query(
      `INSERT INTO users (fullName, email, password, location, number, isAdmin) 
         VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, password, location, number, isAdmin]
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
    const { fullName, email, password, location, number } = req.body;

    const [data] = await dbPool.query(
      `UPDATE users SET fullName = ?, email = ?, password = ?, location = ?, number = ? WHERE id = ?`,
      [fullName, email, password, location, number, userId]
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
      message: "student deleted successfully",
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
