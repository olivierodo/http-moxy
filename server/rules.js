const Storage = require('./services/storage')

module.exports = {
  summary: 'A rule to manage to mock by request id',
  * beforeSendRequest (req) {
    const reqId = req.requestOptions.headers['request-id']
    if (!reqId) return null

    let request = Storage.get(reqId)
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

    Storage.put(reqId, request, 600000) // 10 min
    return {
      response: request.mock
    }
  }
}
