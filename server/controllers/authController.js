const bcrypt = require("bcrypt");
const dbPool = require("../config/db");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "email or password is required" });
  }
  const [user] = await dbPool.query(`SELECT * FROM users WHERE email=?`, [
    email,
  ]);
  if (user.length === 0) {
    return res.status(404).send({ message: "user not found" });
  }
  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) {
    return res.status(400).send({ message: "Invalid email or password" });
  }
  const token = jwt.sign(
    {
      id: user[0].id,
      email: user[0].email,
    },
    process.env.JWT_SECRET || "secret--key",
    { expiresIn: "1h" }
  );
  const userData = {
    id: user[0].id,
    name: user[0].fullName,
    email: user[0].email,
    phone: user[0].number,
    location: user[0].location,
    isAdmin: user[0].isAdmin,
  };
  res
    .status(200)
    .send({ message: "Login successful", token: token, data: userData });
};
module.exports = login;
