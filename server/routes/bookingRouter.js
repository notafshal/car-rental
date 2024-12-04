const express = require("express");
const { getBookingsByUser } = require("../controllers/bookingController");

const bookingRouter = express.Router();

bookingRouter.get("/users/:userId", getBookingsByUser);

module.exports = bookingRouter;
