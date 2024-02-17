// reviewController.js: Manages CRUD operations for reviews on meals.

const Review = require("../models/Review"); // Importing the Review model.
const Meal = require("../models/Meal"); // Importing the Meal model for validation.

const { StatusCodes } = require("http-status-codes"); // HTTP status codes for response statuses.
const CustomError = require("../errors"); // Custom error handling utilities.
const { checkPermissions } = require("../utils"); // Utility function for permission checks.

/**
 * Creates a review for a meal. Validates the meal and checks if the user has already submitted a review for the meal.
 */
const createReview = async (req, res) => {
  const { meal: mealId } = req.body; // Extracting meal ID from the request body.

  // Validate if the referenced meal exists.
  const isValidMeal = await Meal.findOne({ _id: mealId });
  if (!isValidMeal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`);
  }

  // Check if the user has already submitted a review for this meal.
  const alreadySubmitted = await Review.findOne({
    meal: mealId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You have already submitted a review for this meal"
    );
  }

  req.body.user = req.user.userId; // Add the user's ID to the review.
  const review = await Review.create(req.body); // Create the review document.
  res.status(StatusCodes.CREATED).json({ review });
};

/**
 * Retrieves all reviews from the database, with meal and user information populated.
 */
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: "meal", select: "name price restaurant" }) // Populates meal details.
    .populate({ path: "user", select: "name" }); // Populates user details (reviewer).

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

/**
 * Retrieves a single review by its ID, with meal and user information populated.
 */
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params; // Extracting review ID from request parameters.

  const review = await Review.findOne({ _id: reviewId })
    .populate({ path: "meal", select: "name price restaurant" }) // Populates meal details.
    .populate({ path: "user", select: "name" }); // Populates user details (reviewer).

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

/**
 * Updates a review by its ID. Validates the review exists and that the user has permission to update it.
 */
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params; // Extracting review ID from request parameters.
  const { rating, title, comment } = req.body; // Extracting updated review details from the request body.

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  // Check if the logged-in user has permission to update this review.
  checkPermissions(req.user, review.user);

  // Update the review details.
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save(); // Save the updated review.
  res.status(StatusCodes.OK).json({ review });
};

/**
 * Deletes a review by its ID. Validates the review exists and that the user has permission to delete it.
 */
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params; // Extracting review ID from request parameters.

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  // Check if the logged-in user has permission to delete this review.
  checkPermissions(req.user, review.user);

  await review.remove(); // Remove the review.
  res.status(StatusCodes.OK).json({ msg: "Success, review has been deleted" });
};

/**
 * Retrieves all reviews for a specific meal by the meal's ID.
 */
const getSingleMealReviews = async (req, res) => {
  const { id: mealId } = req.params; // Extracting meal ID from request parameters.

  const reviews = await Review.find({ meal: mealId }); // Find all reviews for the specified meal.
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// Exporting controller functions to be used in route definitions.
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleMealReviews,
};
