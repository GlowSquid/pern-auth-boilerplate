const pool = require("../config/dbConfig");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v4");

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorResponse("Please provide an email and password", 400));
  }
  const salt = await bcrypt.genSalt(11);
  const password_hash = await bcrypt.hash(password, salt);

  try {
    pool.query(
      "SELECT id FROM account WHERE email = $1",
      [email],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.rows[0]) {
          console.log("already exist", result.rows[0]);
          return next(new errorResponse(`${email} is already registered`, 401));
        } else {
          console.log("ok");
          const created = new Date();
          const role = "user";
          const id = uuid();
          pool.query(
            `INSERT INTO account (id, email, password_hash, role, created) VALUES ($1, $2, $3, $4, $5)`,
            [id, email, password_hash, role, created],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                pool.query("COMMIT");
                setSession(id, 200, res);
              }
            }
          );
        }
      }
    );
  } catch (err) {
    try {
      await pool.query("ROLLBACK");
    } catch (rollbackErr) {
      console.log("rollbackErr", rollbackErr);
    }
    console.log(err);
  }
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorResponse("Please provide an email and password", 400));
  }
  try {
    pool.query(
      `SELECT id, email, password_hash FROM account WHERE email = $1`,
      [email],
      (err, result) => {
        if (err) {
          console.log("ERR", err);
        }
        if (result.rows[0] == null) {
          return next(new errorResponse("Wrong email or password", 401));
        } else {
          bcrypt.compare(
            password,
            result.rows[0].password_hash,
            (err, check) => {
              if (err) {
                return next(
                  new errorResponse("There was an error logging in", 401)
                );
              } else if (check) {
                const id = result.rows[0].id;
                setSession(id, 200, res);
              } else {
                return next(new errorResponse("Wrong email or password", 401));
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

const getSignedToken = id => {
  const payload = { id };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const setSession = (id, statusCode, res) => {
  const token = getSignedToken(id);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      id
    });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  pool.query(
    "SELECT id, email, role, created FROM account WHERE id = $1",
    [req.account.id],
    (err, result) => {
      if (err) {
        console.log("err", err);
      }
      res.status(200).json({ success: true, data: result.rows[0] });
    }
  );
});

// @desc    Log out / Clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Remove User
// @route   DEL /api/v1/auth/delete
// @access  Private
exports.drop = asyncHandler(async (req, res, next) => {
  // logout
  if (req.account) {
    console.log("req", req.account);
    try {
      pool.query(
        "DELETE FROM account WHERE id = $1",
        [req.account.id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({
              success: true,
              data: {}
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    return next(new errorResponse("No ID", 404));
  }
});
