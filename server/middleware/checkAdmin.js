const jwt = require("jsonwebtoken");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const verifyToken = async (req, res, next) => {
  const token = getTokenFrom(req);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
  const jwtKey = process.env.JWT_SECRET;
  if (!jwtKey) {
    return res
      .status(500)
      .json({ message: "Internal Server Error: JWT_SECRET not defined." });
  }
  try {
    const decoded = jwt.verify(token, jwtKey);

    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token", error: err });
  }
};

module.exports = verifyToken;
