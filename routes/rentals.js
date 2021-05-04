const express = require('express');
const router = express.Router();

const { validate, Rental } = require('../models/rental');
const { movie, Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  res.send(rental);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie out of stock');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.send(rental);
});

router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  res.send(rental);
});

module.export = router;
