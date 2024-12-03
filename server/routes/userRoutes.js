const express = require("express");
const {
  getUsers,
  getUserById,
  registerUser,
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", registerUser);
module.exports = userRouter;
