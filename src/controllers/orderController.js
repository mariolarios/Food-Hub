// orderController.js: Manages order-related operations including creation, retrieval, and update of orders.

const Order = require("../models/Order"); // Importing the Order model.
const Meal = require("../models/Meal"); // Importing the Meal model for order item references.

const { StatusCodes } = require("http-status-codes"); // HTTP status codes for standardized responses.
const CustomError = require("../errors"); // Custom error handling utilities.
const { checkPermissions } = require("../utils"); // Utility function for permission checking.

// Simulated Stripe API for demonstration purposes. In a production environment, you would replace this
// with real payment processing logic.
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "RandomSecret";
  return { client_secret, amount };
};

/**
 * Creates a new order with the items specified in the request body, calculates the total cost,
 * and simulates a payment intent creation using a fake Stripe API.
 */
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body; // Destructuring the order details from the request body.

  // Validate the order details.
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("There are no items in the cart");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please include tax and shipping fee"
    );
  }

  // Process each item in the order.
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbMeal = await Meal.findOne({ _id: item.meal });
    if (!dbMeal) {
      throw new CustomError.NotFoundError(`No meal with id: ${item.meal}`);
    }
    const { name, price, image, _id } = dbMeal;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems.push(singleOrderItem);
    subtotal += item.amount * price;
  }

  // Calculate the total cost and simulate payment intent.
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  // Create the order in the database.
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

/**
 * Retrieves all orders from the database.
 */
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

/**
 * Retrieves a single order by its ID, provided in the request parameters.
 */
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user); // Check if the user has permission to view this order.
  res.status(StatusCodes.OK).json({ order });
};

/**
 * Retrieves all orders placed by the currently authenticated user.
 */
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

/**
 * Updates the status of an order to 'paid' once the payment is completed.
 */
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user); // Verify user permission to update the order.

  // Update the order status.
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

// Exporting controller functions to be used in route definitions.
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
