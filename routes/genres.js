const Joi = require('joi')
const express = require('express');
const router = express.Router()

const genres = [
  { id: 1, name: "Horror" },
  { id: 2, name: "Action" },
  { id: 3, name: "Thriller" },
  { id: 4, name: "Sci-fiction"}
]

router.get('/', (req, res) => {
  res.send(genres);
})

router.get('/:id', (req, res) => {
  const genre = genres.find(g => g.id === Number(req.params.id));
  if (!genre) return res.status(404).send('Genre not found')
  res.send(genre)
})

router.post('/', (req, res) => {
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message)
  genres.push(genre)
  res.send(genre)
})

router.put('/:id', (req, res) => {
  const genre = genres.find(g => g.id === Number(req.params.id));
  if (!genre) return res.status(404).send('Genre not found')

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  genre.name = req.body.name
  res.send(genre)
})

router.delete('/:id', (req, res) => {
  const genre = genres.find(g => g.id === Number(req.params.id))
  if (!genre) return res.status.send('Genre not found')

  const index = genres.indexOf(genre);
  genres.splice(index, 1)
  res.send(genre)
})

const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema)
}

module.exports = router