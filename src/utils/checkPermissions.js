// utils/checkPermissions.js: Utility function to check user permissions for accessing resources.

const CustomError = require("../errors"); // Import custom error classes for error handling.

/**
 * Checks if the requesting user has permission to access a specific resource.
 * Admin users are granted universal access, while other users must be the resource owner.
 *
 * @param {Object} requestUser - The user object extracted from the request, typically after authentication.
 * @param {string|Object} resourceUserId - The user ID associated with the resource being accessed. Can be a string or an object that can be converted to a string.
 * @throws {UnauthorizedError} If the user does not have permission to access the resource.
 */
const checkPermissions = (requestUser, resourceUserId) => {
  // Allow access if the user is an admin.
  if (requestUser.role === "admin") return;

  // Allow access if the user ID matches the resource's user ID.
  if (requestUser.userId === resourceUserId.toString()) return;

  // If neither condition is met, the user does not have permission.
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

module.exports = checkPermissions; // Export the function for use in route handlers and middleware.
