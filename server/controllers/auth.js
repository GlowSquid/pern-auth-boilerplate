const pool = require("../config/dbConfig");
const asyncHandler = require("../middleware/async");
const bcrypt = require("bcryptjs");

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  console.log("ÆÆÆÆÆÆÆÆÆÆÆÆÆÆ", process.env.POSTGRES_DB);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Please provide your email and a password");
  }
  const salt = await bcrypt.genSalt(11);
  const password_hash = await bcrypt.hash(password, salt);
  const created = new Date();
  console.log(`Creating user ${email}`);
  console.log("password", password);
  console.log("pass hash", password_hash);
  console.log("created", created);

  pool.query(
    `INSERT INTO users(email, password_hash, created) VALUES($1, $2, $3)`,
    [email, password_hash, created],
    error => {
      if (error) console.log(error);
    }
  );
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {});
