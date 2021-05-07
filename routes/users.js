const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

const { User, validate } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.")

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  await user.save()

  const toBePicked = _.pick(user, ['_id', 'name', 'email'])
  res.send(toBePicked);
});


module.exports = router;