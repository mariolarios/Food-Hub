const Meal = require("../models/Meal");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
/// CREATE  MEAL
const createMeal = async (req, res) => {
  req.body.user = req.user.userId;
  const meal = await Meal.create(req.body);
  res.status(StatusCodes.CREATED).json({ meal });
};
/// GET ALL MEALS
const getAllMeals = async (req, res) => {
  const meals = await Meal.find({});

  res.status(StatusCodes.OK).json({ meals, count: meals.length });
};
/// GET SINGLE MEAL
const getSingleMeal = async (req, res) => {
  const { id: mealId } = req.params;

  const meal = await Meal.findOne({ _id: mealId }).populate("reviews");

  if (!meal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`);
  }

  res.status(StatusCodes.OK).json({ meal });
};
/// UPDATE MEAL
const updateMeal = async (req, res) => {
  const { id: mealId } = req.params;

  const meal = await Meal.findOneAndUpdate({ _id: mealId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!meal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`);
  }

  res.status(StatusCodes.OK).json({ meal });
};
/// DELETE MEAL
const deleteMeal = async (req, res) => {
  const { id: mealId } = req.params;

  const meal = await Meal.findOne({ _id: mealId });

  if (!meal) {
    throw new CustomError.NotFoundError(`No meal with id: ${mealId}`);
  }

  await meal.remove();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Success! The meal has been removed." });
};
/// UPLOAD IMAGE
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  const mealImage = req.files.image;

  if (!mealImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;

  if (mealImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${mealImage.name}`
  );
  await mealImage.mv(imagePath);
  //response
  res.status(StatusCodes.OK).json({ image: `/uploads/${mealImage.name}` });
};

module.exports = {
  createMeal,
  getAllMeals,
  getSingleMeal,
  updateMeal,
  deleteMeal,
  uploadImage,
};
