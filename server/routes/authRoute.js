const express = require("express");
const { register, login, getMe } = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/me", protect, getMe);
module.exports = authRoute;
