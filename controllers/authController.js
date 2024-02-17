// authController.js: Handles authentication processes including registration, login, and logout.

const User = require("../models/User"); // Importing the User model for database operations
const { StatusCodes } = require("http-status-codes"); // Importing HTTP status codes for response status
const CustomError = require("../errors"); // Custom error handling utilities
const { attachCookiesToResponse, createTokenUser } = require("../utils"); // Utility functions for token management and response handling

/**
 * Registers a new user with the provided email, name, and password. Automatically assigns
 * the role of 'admin' to the first registered user and 'user' to others. Responds with the
 * newly created user object.
 */
const register = async (req, res) => {
  const { email, name, password } = req.body; // Extracting user details from request body

  // Check if email already exists in the database
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // Determine if the new account is the first account
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user"; // Assign role based on account order

  // Create new user with provided details and assigned role
  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user); // Create a token user object for cookie
  attachCookiesToResponse({ res, user: tokenUser }); // Attach token to response as a cookie
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

/**
 * Logs in a user by validating the provided email and password. If successful, responds
 * with the logged-in user object.
 */
const login = async (req, res) => {
  const { email, password } = req.body; // Extracting credentials from request body

  // Validate input
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  // Attempt to find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  // Validate password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user); // Create a token user object for cookie
  attachCookiesToResponse({ res, user: tokenUser }); // Attach token to response as a cookie
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

/**
 * Logs out the current user by clearing the authentication cookie.
 */
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true, // Enhances security by restricting client-side script access to the cookie
    expires: new Date(Date.now()), // Set expiration to immediately expire the cookie
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

// Exporting the controller functions to be used in routes
module.exports = {
  register,
  login,
  logout,
};
