const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // console.log("middleware auth token", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new errorResponse("Not authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED", decoded);

    const client = await pool.connect();
    await client.query("BEGIN");

    await JSON.stringify(
      client.query(
        `SELECT id FROM account WHERE id = $1`,
        [decoded.id],
        function(err, result) {
          if (err) {
            console.log(err);
          }
          if (result.rows[0]) {
            req.account = result.rows[0];
            console.log("req.account.id", req.account.id);
            next();
            // return result.rows[0];
          } else {
            console.log("nope");
          }
        }
      )
    );
  } catch (err) {
    return next(new errorResponse("Not authorized to access this route", 401));
  }
});
