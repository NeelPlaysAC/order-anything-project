const express = require("express");
const admin = require("../routes/admin");
const agents = require("../routes/agents");
const dilivery = require("../routes/dilivery");
const orders = require("../routes/orders");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/admin", admin);
  app.use("/api/agents", agents);
  app.use("/api/dilivery", dilivery);
  app.use("/api/orders", orders);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
