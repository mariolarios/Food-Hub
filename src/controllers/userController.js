// userController.js: Handles user-related operations such as retrieval and update of user information.

const User = require("../models/User"); // Importing the User model for database operations.
const { StatusCodes } = require("http-status-codes"); // HTTP status codes for response statuses.
const CustomError = require("../errors"); // Custom error handling utilities.
const {
  createTokenUser, // Utility to create a user object suitable for generating tokens.
  attachCookiesToResponse, // Utility to attach tokens as cookies in the response.
  checkPermissions, // Utility for permission checks between users.
} = require("../utils");

/**
 * Retrieves all users with the role of 'user' from the database, excluding their passwords from the response.
 */
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password"); // Select all but exclude password.
  res.status(StatusCodes.OK).json({ users });
};

/**
 * Retrieves a single user by their ID, excluding the password from the response. Checks permissions to ensure
 * the requesting user has the right to access the requested user's information.
 */
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id); // Permission check to ensure user can only access their own information unless they're admin.
  res.status(StatusCodes.OK).json({ user });
};

/**
 * Shows the currently authenticated user's information.
 */
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

/**
 * Updates the current user's name and email. Requires the user to be authenticated.
 */
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save(); // Saves the updated user information to the database.

  const tokenUser = createTokenUser(user); // Creates a new token user object.
  attachCookiesToResponse({ res, user: tokenUser }); // Attaches the updated token to the response.
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

/**
 * Allows the user to update their password. Validates the old password before updating to the new password.
 */
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  user.password = newPassword; // Updates the user's password.
  await user.save(); // Hashes the new password before saving due to the pre-save middleware in the User model.
  res.status(StatusCodes.OK).json({ msg: "Success! Password updated." });
};

// Exporting controller functions to be used in user routes.
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
