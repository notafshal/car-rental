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
    const {
      fullName,
      email,
      location,
      number,
      booking_history,
      favourite_vechile,
      reservations,
      isAdmin,
    } = req.body;

    // Validate input
    if (
      !fullName ||
      !email ||
      !location ||
      !number ||
      !booking_history ||
      !favourite_vechile ||
      !reservations ||
      isAdmin === undefined
    ) {
      return res.status(400).send({ message: "Provide all fields" });
    }

    // Insert into database
    const [result] = await dbPool.query(
      `INSERT INTO users (fullName, email, location, number, booking_history, favourite_vechile, reservations,isAdmin) 
         VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
      [
        fullName,
        email,
        location,
        number,
        booking_history,
        favourite_vechile,
        reservations,
        isAdmin,
      ]
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
module.exports = { getUsers, getUserById, registerUser };
