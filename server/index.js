const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbPool = require("./config/db");
const userRouter = require("./routes/userRoutes");
const carRouter = require("./routes/carRoutes");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/users", userRouter);
app.use("/api/cars", carRouter);
app.get("/", (req, res) => {
  res.status(200).send("<h1>Running</h1>");
});

const PORT = process.env.PORT || 8000;
dbPool
  .query("SELECT 1")
  .then(() => {
    console.log("MYSQL DB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
