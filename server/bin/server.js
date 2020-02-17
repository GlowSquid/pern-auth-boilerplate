const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");

const PORT = parseInt(process.env.PORT, 10) || 5000;

const authRoute = require("../routes/authRoute");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json()); // bodyparser
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRoute);

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const server = app.listen(PORT, err => {
  if (err) throw err;
  // console.log(`> App on ${process.env.NODE_ENV} :${PORT}`.yellow.bold);
  console.log(
    "> App on " + `${process.env.NODE_ENV}`.blue + `:${PORT}`.yellow.bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error log: ${err.message}`.red.underline.bold);
  server.close(() => process.exit(1));
});
