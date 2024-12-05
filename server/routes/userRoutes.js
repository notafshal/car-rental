const express = require("express");
const {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", registerUser);
userRouter.put("/:id", verifyToken, updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);

module.exports = userRouter;
