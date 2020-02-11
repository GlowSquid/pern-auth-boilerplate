const express = require("express");
const { register, login } = require("../controllers/auth");

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
module.exports = authRoute;
