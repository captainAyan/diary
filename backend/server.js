const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const cors = require("cors");

const { errorHandler, ErrorResponse } = require("./middleware/errorMiddleware");
const { PER_MINUTE_REQUEST_LIMIT } = require("./constants/policies");

require("dotenv").config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = process.env.MONGODB_URI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(morgan("tiny"));

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === "production" ? PER_MINUTE_REQUEST_LIMIT : Infinity,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, _next) => {
    throw createHttpError(StatusCodes.TOO_MANY_REQUESTS, "Too many requests");
  },
});
// app.use(limiter); // limits all paths

app.use("/api", require("./routes/api"));

// Serve frontend

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "frontend", "dist");

  // app.use(express.static(path.join(__dirname, "../frontend/dist/")));
  app.use(express.static(distPath));

  app.get("/{*any}", (req, res) =>
    res.sendFile(
      // path.resolve(__dirname, "../", "frontend", "dist", "index.html")
      path.join(distPath, "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use("/{*any}", (req, res, next) => {
  throw new ErrorResponse("Not found", StatusCodes.NOT_FOUND);
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
