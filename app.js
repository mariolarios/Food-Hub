// Load environment variables from .env file
require("dotenv").config();

// Automatically applies try-catch to all async routes, eliminating the need for repetitive try-catch blocks
require("express-async-errors");

// Importing core modules
const express = require("express");
const app = express(); // Creating an Express application instance

// Importing middleware packages for logging, parsing, and security
const morgan = require("morgan"); // HTTP request logger
const cookieParser = require("cookie-parser"); // Parse Cookie header and populate req.cookies
const fileUpload = require("express-fileupload"); // Middleware for handling multipart/form-data, mainly used for uploading files
const rateLimiter = require("express-rate-limit"); // Basic rate-limiting middleware to prevent brute-force attacks
const helmet = require("helmet"); // Helps secure Express apps by setting various HTTP headers
const xss = require("xss-clean"); // Middleware to sanitize user input to prevent XSS attacks
const mongoSanitize = require("express-mongo-sanitize"); // Prevents MongoDB Operator Injection

// Database connection setup
const connectDB = require("./db/connect");

// Routers for different API endpoints
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const mealRouter = require("./routes/mealRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// Middleware for handling not found and error handling
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Security configurations
app.set("trust proxy", 1); // Trust the first proxy, necessary for secure cookies in production
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60, // Limit each IP to 60 requests per windowMs
  })
);

app.use(helmet()); // Sets various HTTP headers for app security
app.use(xss()); // Sanitizes user input coming from POST body, GET queries, and url params
app.use(mongoSanitize()); // Removes any keys in requests that start with a dollar sign

// Middleware for parsing JSON and urlencoded data and handling cookies
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cookieParser(process.env.JWT_SECRET)); // Parses cookies attached to the client request object

// Static files and file upload configurations
app.use(express.static("public")); // Serves static files from the 'public' directory
app.use(fileUpload()); // Enables file upload capabilities

// Root route for basic API response
app.get("/", (req, res) => {
  res.send("Food-Hub API");
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meals", mealRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// Middleware to handle requests for non-existent routes
app.use(notFoundMiddleware);
// Custom error handling middleware to catch and format errors
app.use(errorHandlerMiddleware);

// Server setup and start
const port = process.env.PORT || 5000; // Default to 5000 if PORT env variable is not set
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL); // Connect to the database
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    ); // Start listening on the specified port
  } catch (error) {
    console.log(error);
  }
};

start(); // Invoke the async function to start the server
