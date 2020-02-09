const express = require('express')
const Routes = require('./routes')
const Middlewares = require('./middlewares')

module.exports = express()
  .use(Middlewares.bodyParser.urlencoded({ extended: false }))
  .use(Middlewares.bodyParser.json())
  .use(Middlewares.helmet)
  .use(Routes)
  .use(Middlewares.errors)

