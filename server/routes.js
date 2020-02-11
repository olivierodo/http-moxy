const Router = require('express').Router()
const Controllers = require('./controllers')

module.exports = Router
  .get('/:id', Controllers.getRequest)
  .post('/:id', Controllers.createRequest)
