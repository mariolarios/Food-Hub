// connect.js: Establishes connection to the MongoDB database using mongoose.

const mongoose = require("mongoose"); // Import mongoose to interact with MongoDB

// Address deprecation warnings by configuring mongoose settings
mongoose.set("strictQuery", false); // Disables strict query mode to avoid deprecation warnings

/**
 * Connects to the MongoDB database using a provided connection string.
 * @param {string} url - The MongoDB connection string.
 * @returns A promise that resolves when the connection is successfully established.
 */
const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true, // Use the new URL parser for MongoDB connection strings
    useUnifiedTopology: true, // Use the new Unified Topology layer
  });
};

module.exports = connectDB; // Export the connectDB function for use in other parts of the application
