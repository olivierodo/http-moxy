const Service = require('./services')
const cache = require('memory-cache')
const httpProxy = require('express-http-proxy')

function mock(req, res, next) {
  let response = Service.getResponse(req.id)
  let mock = {
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
    response
  }
  cache.put(req.id, mock, 600000); // 10 min
  res
    .set(response.headers)
    .send(response.body)
}

function inspect(req, res, next) {
  let mock = cache.get(req.params.id)
  res.json(mock || {})
}

module.exports = {
  mock,
  inspect
}
