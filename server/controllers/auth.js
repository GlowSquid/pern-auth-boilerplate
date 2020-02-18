const pool = require("../config/dbConfig");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const redis = require("redis");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v4");

exports.redisClient = redis.createClient(process.env.REDIS_URI);

this.redisClient.on("connect", function() {
  console.log("Redis online");
});

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

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await JSON.stringify(
      client.query("SELECT id FROM account WHERE email = $1", [email], function(
        err,
        result
      ) {
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
          client.query(
            `INSERT INTO account (id, email, password_hash, role, created) VALUES ($1, $2, $3, $4, $5)`,
            [id, email, password_hash, role, created],
            function(err, result) {
              if (err) {
                console.log(err);
              } else {
                client.query("COMMIT");
                setSession(id, 200, res);
              }
            }
          );
        }
      })
    );
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.log("rollbackErr", rollbackErr);
    }
    console.log(err);
  } finally {
    client.release();
    console.log("closing");
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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await JSON.stringify(
      client.query(
        `SELECT id, email, password_hash FROM account WHERE email = $1`,
        [email],
        function(err, result) {
          if (err) {
            console.log("ERR", err);
          }
          if (result.rows[0] == null) {
            return next(new errorResponse("Wrong email or password", 401));
          } else {
            bcrypt.compare(password, result.rows[0].password_hash, function(
              err,
              check
            ) {
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
            });
          }
        }
      )
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
    console.log("closing");
  }
});

const setToken = (key, value) =>
  Promise.resolve(this.redisClient.set(key, value));

const getSignedToken = id => {
  const payload = { id };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const setSession = (id, statusCode, res) => {
  const token = getSignedToken(id);
  setToken(token, id);
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
// @access  Private Æ
exports.getMe = asyncHandler(async (req, res, next) => {
  const client = await pool.connect();
  await client.query("BEGIN");

  await client.query(
    "SELECT id, email, role, created FROM account WHERE id = $1",
    [req.account.id],
    function(err, result) {
      if (err) {
        console.log("err", err);
      }
      if (result.rows[0]) {
        // console.log("result.rows[0]", result.rows[0]);
        res.status(200).json({ success: true, data: result.rows[0] });
      } else {
        console.log("Something went wrong");
      }
    }
  );
});
