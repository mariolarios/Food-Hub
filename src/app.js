require("dotenv").config();
///applies try and catch to all controllers automatically
require("express-async-errors");

///import express
const express = require("express");
const app = express();

///Rest of the packages

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

///set up database
const connectDB = require("./db/connect");

/// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const mealRouter = require("./routes/mealRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

/// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

///security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

///express json
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("food-hub");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meals", mealRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

///use middleware...this is placed after the routes
///because it runs to see if the routes exist before executing the middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

/// set up port
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
