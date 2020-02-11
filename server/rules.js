const cache = require('memory-cache')

module.exports = {
  summary: 'a rule to hack response',
  * beforeSendRequest (req) {
    const reqId = req.requestOptions.headers['request-id']
    let request = cache.get(reqId)
    if (!request) return null

    request = {
      id: reqId,
      method: req.requestOptions.method,
      url: req.requestOptions.hostname,
      path: req.requestOptions.path,
      headers: req.requestOptions.headers,
      body: Buffer.from(req.requestData).toString('utf-8'),
      mock: request.mock
    }

    cache.put(reqId, request, 600000) // 10 min
    return {
      response: request.mock
    }
  }
}
