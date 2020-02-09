const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const folder = path.join(__dirname, '/../mock-responses/')

function getResponse (requestId) {
  let response = {}
  try {
    const match = requestId.match(/-(.*-\d{3}.mock)$/)
    if (match) {
      const filename = folder + match[1] + '.yml'
      response = yaml.safeLoad(fs.readFileSync(filename))
    }
  } catch (e) {
    response.headers = {
      'x-error': e.message
    }
  }
  return response
}

module.exports = {
  getResponse
}
