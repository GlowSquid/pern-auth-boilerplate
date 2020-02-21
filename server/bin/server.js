const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const colors = require("colors");
const cors = require("cors");

const PORT = parseInt(process.env.PORT, 10) || 5000;

const authRoute = require("../routes/authRoute");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json()); // bodyparser
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use("/api/v1/auth", authRoute);

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
