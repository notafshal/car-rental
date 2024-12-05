const express = require("express");
const { getBookingsByUser } = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

const bookingRouter = express.Router();

bookingRouter.get("/users/:userId", verifyToken, getBookingsByUser);

module.exports = bookingRouter;
