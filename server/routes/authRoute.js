const express = require("express");
const { check, validationResult } = require("express-validator");
const { register, login, logout, getMe, drop } = require("../controllers/auth");
const errorResponse = require("../utils/errorResponse");

const { protect } = require("../middleware/auth");

const authRoute = express.Router();

authRoute.post(
  "/register",
  [
    check("email", "Please provide a proper email")
      .isEmail()
      .normalizeEmail(),
    check("password", "Passwords must be between 6 and 32 characters")
      .isLength({ min: 6, max: 32 })
      .not()
      .isIn([
        "123456",
        "password",
        "pass1234",
        "password123",
        "12345678",
        "justinbieber"
      ])
      .withMessage("Please pick a better password")
      .trim()
      .escape()
  ],
  (req, res, next) => {
    // console.log(req);
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new errorResponse(err.errors[0].msg, 422));
    } else {
      next();
    }
  },
  register
);

authRoute.post(
  "/login",
  [
    check("email")
      .isEmail()
      .normalizeEmail(),
    check("password")
      .trim()
      .escape()
  ],
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new errorResponse(err.errors[0].msg, 422));
    } else {
      next();
    }
  },
  login
);
authRoute.get("/logout", logout);
authRoute.delete("/delete", protect, drop);
authRoute.get("/me", protect, getMe);

module.exports = authRoute;
