const auth = require("../middleware/auth");
const Joi = require("Joi");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Agent, validate } = require("../models/agent");
const express = require("express");
const router = express.Router();

// Agent route to get currently logged in agent's details
router.get("/me", auth, async (req, res) => {
  const agent = await Agent.findById(req.user._id).select([
    "_id",
    "name",
    "phone",
  ]);
  res.send(agent);
});

// Agent route to change assigned order's status
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let agent = await Agent.findOne({ phone: req.body.phone });
  if (agent) return res.status(400).send("Agent already registered.");

  agent = new Agent(_.pick(req.body, ["name", "phone", "password"]));
  const salt = await bcrypt.genSalt(10);
  agent.password = await bcrypt.hash(agent.password, salt);
  await agent.save();
  const token = agent.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(agent, ["_id", "name", "phone"]));
});

// Agent route to generate authentication token.
router.post("/auth", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let agent = await Agent.findOne({ phone: req.body.phone });
  if (!agent) return res.status(400).send("Invalid phone or password.");

  const validPassword = await bcrypt.compare(req.body.password, agent.password);
  if (!validPassword) return res.status(400).send("Invalid phone or password.");

  const token = agent.generateAuthToken();
  res.send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
