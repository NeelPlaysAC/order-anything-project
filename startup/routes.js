const express = require("express");
const admin = require("../src/routes/admin");
const agents = require("../src/routes/agents");
const dilivery = require("../src/routes/dilivery");
const orders = require("../src/routes/orders");
const users = require("../src/routes/users");
const auth = require("../src/routes/auth");
const error = require("../src/middleware/error");

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
