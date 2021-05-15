const Joi = require("joi");
const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    items: {
      type: [Number],
      required: true,
    },
    quantity: {
      type: [Number],
      required: true,
    },
    agentId: {
      type: String,
      default: "NA",
    },
    orderStage: {
      type: String,
      default: "Task Created",
    },
    customerId: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    locations: {
      type: [String],
      default: [],
    },
  })
);

function validateMovie(order) {
  const schema = Joi.object({
    items: Joi.array().required(),
    quantity: Joi.array().required(),
  });
  return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateMovie;
