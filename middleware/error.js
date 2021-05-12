module.exports = function(error, req, res, next) {
  res.status(401).send('Something failed')
}