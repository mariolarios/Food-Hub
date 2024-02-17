// bad-request.js: Defines the BadRequestError class extending CustomAPIError for handling 400 Bad Request errors.

const { StatusCodes } = require("http-status-codes"); // Importing HTTP status codes for standardized responses
const CustomAPIError = require("./custom-api"); // Import the base class for custom API errors

/**
 * BadRequestError class for handling HTTP 400 errors.
 * Extends CustomAPIError to provide a specific error type for bad requests,
 * setting a standard HTTP 400 status code and a custom message.
 */
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message); // Call the parent class constructor with the message
    this.statusCode = StatusCodes.BAD_REQUEST; // Set the HTTP status code to 400 Bad Request
  }
}

module.exports = BadRequestError; // Export the class for use elsewhere in the application
