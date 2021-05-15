const { Order, validate } = require("../models/order");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { items } = require("../../catalogue");

// User route to get all orders of current user
router.get("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  req.user = decoded;

  const query = { customerId: req.user };
  const order = await Order.find(query).sort("name");
  res.send(order);
});

// User route to create new orders
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const products = req.body.items;
  let locations = [];

  for (let product of products) {
    if (product > 5 || product < 1)
      return res.status(400).send("Invalid products");
    locations.push(items[product]["Addresses"][Math.floor(Math.random() * 2)]);
  }

  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  req.user = decoded;

  let order = new Order({
    items: req.body.items,
    quantity: req.body.quantity,
    customerId: req.user,
    locations: locations,
  });
  order = await order.save();
  res.send(order);
});

module.exports = router;
