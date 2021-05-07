const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
})

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = {
    name: Joi().string().min(5).max(50),
    email: Joi().string().unique().min(5).max(50),
    password: Joi().string().min(5).max(50)
  }
  
  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser