const mongoose = require("mongoose");

/// Takes care od deprecation warnings
mongoose.set("strictQuery", false);

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
