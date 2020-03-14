const Storage = require('./services/storage')
const Broker = require('./services/broker')

module.exports = {
  summary: 'Custom rule restQa',
  * beforeSendRequest (req) {
    if (req.requestOptions.path === '/ready.k8s.http') {
      return {
        response: {
          statusCode: 204,
          header: { 'content-type': 'text/html' },
          body: ''
        }
      }
    }
    const reqId = req.requestOptions.headers[process.env.HEADER_REQUEST_ID_PROPERTY || 'x-request-id']
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
  },
  * beforeSendResponse (req, res) {
    const msg = {
      request: {
        ...req.requestOptions,
        body: Buffer.from(req.requestData).toString('utf-8')
      },
      response: {
        statusCode: res.response.statusCode,
        header: res.response.header,
        body: res.response.body.toString('utf-8')
      }
    }
    Broker.publish(msg)
  }

}
