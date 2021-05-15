const { Order } = require("../models/order");
const { Agent } = require("../models/agent");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Admin route to get all orders (with status filter)
router.get("/orders", [auth, admin], async (req, res) => {
  let orders;
  if (req.body.filter) {
    const query = { orderStage: req.body.filter };
    orders = await Order.find(query).sort("name");
  } else {
    orders = await Order.find().sort("name");
  }
  res.send(orders);
});

//Admin route to get all dilivery agents
router.get("/agents", [auth, admin], async (req, res) => {
  const agents = await Agent.find().sort("name").select(["name", "phone"]);
  res.send(agents);
});

// Admin route to get orders by id & assign agent
router.put("/orders/:id", [auth, admin], async (req, res) => {
  const agentId = req.body.agentId;
  if (!agentId) return res.status(400).send("agentId is required");

  try {
    let agent = await Agent.findById(agentId);
  } catch (ex) {
    return res.status(404).send("Invalid agent Id");
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { agentId: req.body.agentId },
    {
      new: true,
    }
  );

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
