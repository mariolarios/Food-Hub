// controllers/mealController.js: Handles all meal-related operations such as creation, retrieval, updating, and deletion.

const Meal = require("../models/Meal"); // Import the Meal model for database interactions.
const { StatusCodes } = require("http-status-codes"); // HTTP status codes for response status.
const CustomError = require("../errors"); // Custom error classes for error handling.
const path = require("path"); // Node.js path module for file path operations.

/**
 * Creates a new meal document in the database with the provided details in the request body.
 */
const createMeal = async (req, res) => {
  req.body.user = req.user.userId; // Assign the meal to the logged-in user.
  const meal = await Meal.create(req.body); // Create the meal document.
  res.status(StatusCodes.CREATED).json({ meal }); // Respond with the created meal.
};

/**
 * Retrieves all meal documents from the database.
 */
const getAllMeals = async (req, res) => {
  const meals = await Meal.find({}); // Find all meals.
  res.status(StatusCodes.OK).json({ meals, count: meals.length }); // Respond with all meals and their count.
};

/**
 * Retrieves a single meal document based on the provided ID in the request parameters.
 */
const getSingleMeal = async (req, res) => {
  const { id: mealId } = req.params; // Extract meal ID from request parameters.
  const meal = await Meal.findOne({ _id: mealId }).populate("reviews"); // Find the meal and populate its reviews.

  if (!meal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`); // Handle meal not found.
  }

  res.status(StatusCodes.OK).json({ meal }); // Respond with the found meal.
};

/**
 * Updates a meal document based on the provided ID in the request parameters with the details in the request body.
 */
const updateMeal = async (req, res) => {
  const { id: mealId } = req.params; // Extract meal ID from request parameters.
  const meal = await Meal.findOneAndUpdate({ _id: mealId }, req.body, {
    new: true, // Return the updated document.
    runValidators: true, // Run model validators on update.
  });

  if (!meal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`); // Handle meal not found.
  }

  res.status(StatusCodes.OK).json({ meal }); // Respond with the updated meal.
};

/**
 * Deletes a meal document based on the provided ID in the request parameters.
 */
const deleteMeal = async (req, res) => {
  const { id: mealId } = req.params; // Extract meal ID from request parameters.
  const meal = await Meal.findOne({ _id: mealId }); // Find the meal.

  if (!meal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`); // Handle meal not found.
  }

  await meal.remove(); // Remove the meal document.
  res
    .status(StatusCodes.OK)
    .json({ msg: "Success! The meal has been removed." }); // Respond with success message.
};

/**
 * Handles the upload of a meal image, validating the file type and size before saving.
 */
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded"); // Handle no file uploaded.
  }
  const mealImage = req.files.image; // Access the uploaded file.

  // Validate file type is an image.
  if (!mealImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image");
  }

  // Validate file size.
  const maxSize = 1024 * 1024; // 1MB
  if (mealImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  // Define the path for the image file.
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${mealImage.name}`
  );
  await mealImage.mv(imagePath); // Move the file to the designated path.

  // Respond with the path of the uploaded image.
  res.status(StatusCodes.OK).json({ image: `/uploads/${mealImage.name}` });
};

// Exporting all controller functions to be used in routes.
module.exports = {
  createMeal,
  getAllMeals,
  getSingleMeal,
  updateMeal,
  deleteMeal,
  uploadImage,
};
