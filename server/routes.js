const Router = require('express').Router()
const Controllers = require('./controllers')
const Middlewares = require('./middlewares')

module.exports = Router
  .get('/_/:id', Controllers.inspect)
  .all('*', Middlewares.requestId, Controllers.mock)

