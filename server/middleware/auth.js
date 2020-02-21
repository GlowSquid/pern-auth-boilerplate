const jwt = require("jsonwebtoken");
const pool = require("../config/dbConfig");
const asyncHandler = require("./async");
const errorResponse = require("../utils/errorResponse");
const { redisClient } = require("../controllers/auth");

exports.getAuth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      console.log(err);
      return res.status(401).send("Unauthorized");
    }
    return res.json({ id: reply });
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
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

    pool.query(
      `SELECT id FROM account WHERE id = $1`,
      [decoded.id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        req.account = result.rows[0];
        if (req.account) {
          console.log("req.account.id", req.account.id);
        }
        next();
      }
    );
  } catch (err) {
    return next(new errorResponse("Not authorized to access this route", 401));
  }
});
