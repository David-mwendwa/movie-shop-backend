require('express-async-errors');
const winston = require('winston')
require('winston-mongodb')
const config = require('config')
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');


const express = require('express');
const app = express();
require('./startup/routes')(app)

process.on('uncaughtException', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1)
})

process.on('unhandledRejection', (ex) => {
  winston.error(ex.message, ex);
  process.exit(1)
});

winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly', level: 'info' });

if (!config.get('jwtPrivateKey')) {
  console.error("FATAL ERROR: jwtPivateKey is not defined.")
  process.exit(1)
}

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('connected to mongoDB...'))
  .catch((err) => console.error('could not connect mongoDB...', err));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
