const Review = require("../models/Review");
const Meal = require("../models/Meal");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
////
const createReview = async (req, res) => {
  const { meal: mealId } = req.body;

  const isValidMeal = await Meal.findOne({ _id: mealId });

  if (!isValidMeal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`);
  }

  const alreadySubmitted = await Review.findOne({
    meal: mealId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You have already submitted a review for this meal"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
////
const getAllReviews = async (req, res) => {
  ///.populate allows the app to show name, price, restaurant
  const reviews = await Review.find({})
    .populate({
      path: "meal",
      select: "name price restaurant",
    })
    .populate({
      path: "user",
      select: "name",
    });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
////
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId })
    .populate({
      path: "meal",
      select: "name price restaurant",
    })
    .populate({
      path: "user",
      select: "name",
    });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
////
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  ///using this so that one user can not update  another users review
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
////
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Success, review has been deleted" });
};

const getSingleMealReviews = async (req, res) => {
  const { id: mealId } = req.params;
  const reviews = await Review.find({ meal: mealId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleMealReviews,
};
