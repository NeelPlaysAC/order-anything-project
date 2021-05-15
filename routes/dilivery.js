const { Order } = require("../models/order");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

const ORDER_STAGES = [
  "Task Created",
  "Reached Store",
  "Items Picked",
  "Enroute",
  "Delivered",
  "Canceled",
];
const ORDER_NOT_FOUND_MESSAGE = "The order with the given ID was not found.";

// Dilivery Agent route to get assigned orders
router.get("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  req.user = decoded;

  const query = { agentId: req.user };
  const order = await Order.find(query).sort("name");
  res.send(order);
});

// Dilivery Agent route to change order stage
router.put("/:id", auth, async (req, res) => {
  const orderStage = req.body.orderStage;
  if (!ORDER_STAGES.includes(orderStage))
    return res.status(400).send("Invalid Order Stage");

  try {
    const updatedOrderStage = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStage: orderStage },
      { new: true }
    );
    if (!updatedOrderStage)
      return res.status(404).send(ORDER_NOT_FOUND_MESSAGE);
    res.send(updatedOrderStage);
  } catch (ex) {
    res.status(404).send(ORDER_NOT_FOUND_MESSAGE);
  }
});

module.exports = router;
