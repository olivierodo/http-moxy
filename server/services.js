const yaml = require('js-yaml')
const fs = require('fs')
const folder = __dirname + '/../mock-responses/'

function getResponse (requestId) {
  let response = {}
  try {
    let match = requestId.match(/-(.*-\d{3}.mock)$/)
    if (match) {
      let filename =  folder + match[1] + '.yml'
      response = yaml.safeLoad(fs.readFileSync(filename))
    }
  } catch(e) {
    response.headers = {
      'x-error': e.message
    }
  }
  return response
}

module.exports = {
  getResponse
}
