const pool = require("../config/dbConfig");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");

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
    const client = await pool.connect();
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
          client.query(
            `INSERT INTO account (email, password_hash, role, created) VALUES ($1, $2, $3, $4)`,
            [email, password_hash, role, created],
            function(err, result) {
              if (err) {
                console.log(err);
              } else {
                client.query("COMMIT");
                // console.log(result);
                res.status(200).json({
                  success: true,
                  data: email
                });
              }
            }
          );
        }
      })
    );
  } catch (err) {
    console.log(err);
  }
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {});
