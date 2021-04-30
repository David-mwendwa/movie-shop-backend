const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlenght: 5,
    maxlenght: 50
  }
})

const Genre = mongoose.model('Genre', genreSchema)


const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema)
}

exports.Genre = Genre;
exports.validate = validateGenre