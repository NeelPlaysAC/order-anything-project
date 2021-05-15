const Joi = require("Joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

// Route to generate authentication token for users.
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(400).send("Invalid phone or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid phone or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
