const express = require("express");
const { register, login, logout, getMe, drop } = require("../controllers/auth");

const { protect, getAuth } = require("../middleware/auth");

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/logout", logout);
authRoute.delete("/delete", protect, drop);
authRoute.get("/me", protect, getMe);
module.exports = authRoute;
