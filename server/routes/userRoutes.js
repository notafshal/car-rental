const express = require("express");
const {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", registerUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
