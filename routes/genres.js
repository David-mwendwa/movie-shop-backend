const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const { Genre, validate } = require('../models/genre');

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  })
);

router.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
  })
);

router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
  })
);

router.put(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
  })
);

router.delete(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Genre not found');
    res.send(genre);
  })
);

module.exports = router;
