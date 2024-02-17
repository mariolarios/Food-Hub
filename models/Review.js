const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a review rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide a review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    meal: {
      type: mongoose.Schema.ObjectId,
      ref: "Meal",
      required: true,
    },
  },
  { timestamps: true }
);
/// set up index for both the user and the meal
/// sets up that the user can only leave one review per meal
ReviewSchema.index({ meal: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (mealId) {
  const result = await this.aggregate([
    { $match: { meal: mealId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Meal").findOneAndUpdate(
      { _id: mealId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.meal);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.meal);
});
module.exports = mongoose.model("Review", ReviewSchema);
