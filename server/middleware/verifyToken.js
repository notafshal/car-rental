const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Token from header:", token);

  if (!token) {
    return res.status(404).send({
      message: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(404).send({ message: "Invalid token" });
    }
    console.log("Decoded user:", user);
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
