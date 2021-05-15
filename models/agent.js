const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

//Agent Schema
const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 2048,
  },
});

agentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Agent = mongoose.model("Agent", agentSchema);

function validateAgent(agent) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(agent);
}

exports.validate = validateAgent;
exports.Agent = Agent;
