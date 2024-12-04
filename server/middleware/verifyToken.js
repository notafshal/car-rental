const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split("")[1];
  if (!token) {
    return res.status(404).send({
      message: "Access token required",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(404).send({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
