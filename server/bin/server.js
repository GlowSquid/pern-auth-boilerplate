const express = require("express");
const dotenv = require("dotenv");
const knex = require("knex");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");

const PORT = parseInt(process.env.PORT, 10) || 5000;

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

// host: process.env.POSTGRES_HOST || "localhost",
// user: process.env.POSTGRES_USER || "postgres",
// password: process.env.POSTGRES_PASSWORD || "postgres",
// database: process.env.POSTGRES_DB || "auther",
// port: 5432

// const pool = new pg.Pool(config);

const authRoute = require("../routes/authRoute");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json()); // bodyparser
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

const server = app.listen(PORT, err => {
  if (err) throw err;
  // console.log(`> App on ${process.env.NODE_ENV} :${PORT}`.yellow.bold);
  console.log(`> App on ${process.env.NODE_ENV}`.blue + `:${PORT}`.yellow.bold);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error log: ${err.message}`.red.underline.bold);
  server.close(() => process.exit(1));
});
