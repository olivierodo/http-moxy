const Service = require('./services')
const cache = require('memory-cache')

function mock (req, res, next) {
  const response = Service.getResponse(req.id)
  const mock = {
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
    response
  }
  cache.put(req.id, mock, 600000) // 10 min
  res
    .set(response.headers)
    .send(response.body)
}

function inspect (req, res, next) {
  const mock = cache.get(req.params.id)
  res.json(mock || {})
}

module.exports = {
  mock,
  inspect
}
