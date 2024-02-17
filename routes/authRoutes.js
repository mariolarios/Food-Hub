// routes/authRoutes.js: Defines routes for user authentication including registration, login, and logout.

const express = require("express");
const router = express.Router(); // Create a new Express router to handle authentication routes

// Import authentication controller functions
const {
  register,
  login,
  logout,
} = require("../controllers/authController");

// Route for user registration. Utilizes the 'register' controller function
// to create a new user in the system.
router.post("/register", register);

// Route for user login. Uses the 'login' controller function
// to authenticate users and issue a JWT for session management.
router.post("/login", login);

// Route for user logout. The 'logout' controller function
// clears the user's session and cookie.
router.get("/logout", logout);

// Additional route to serve documentation as a static HTML file.
// This route serves the 'docs.html' file located in the same directory.
router.get("/docs", (req, res) => {
  // Send the docs.html file to the client
  res.sendFile(__dirname + "/docs.html");
});

module.exports = router; // Export the router for use in the application's main entry point (typically app.js)
