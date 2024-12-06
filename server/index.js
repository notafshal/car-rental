const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbPool = require("./config/db");
const userRouter = require("./routes/userRoutes");
const carRouter = require("./routes/carRoutes");
const bookingRouter = require("./routes/bookingRouter");
const authRouter = require("./routes/auth");
const cors = require("cors");
const path = require("path");
dotenv.config();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);

app.use("/api/cars", carRouter);
app.use("/api/users", userRouter);
app.use("/api/booking", bookingRouter);

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
