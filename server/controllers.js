const cache = require('memory-cache')

function createRequest (req, res, next) {
  const { mock } = req.body

  if (!mock.statusCode) return next('The request body should include the \'mock.statusCode\' propery')
  if (!mock.header) return next('The request body should include the \'mock.header\' propery')
  if (!mock.body) return next('The request body should include the \'mock.body\' propery')

  const request = {
    id: req.params.id,
    ...req.body
  }
  cache.put(request.id, request, 600000) // 10 min
  res.status(201).json(request)
}

function getRequest (req, res, next) {
  const request = cache.get(req.params.id) || {}
  res.json(request)
}

module.exports = {
  getRequest,
  createRequest
}
