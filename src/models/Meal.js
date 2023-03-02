const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide meal name"],
      maxLength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide meal price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide meal description"],
      maxLength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide meal category"],
      enum: ["pizza", "burgers", "tacos"],
    },
    restaurant: {
      type: String,
      required: [true, "Please provide restaurant name"],
      enum: {
        values: ["dominoes", "burger king", "taco bell"],
        message: "{VALUE} is not supported",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MealSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "meal",
  justOne: false,
});

MealSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ meal: this._id });
});

module.exports = mongoose.model("Meal", MealSchema);
