function requestId(req, res, next) {
  let err
  req.id = req.headers['request-id']
  if (!req.id) err = 'The request header is missing the request-id value'
  next(err)
}

function errors (err, req, res, next) {
  return res
    .status(500)
    .json({ message: err.message || err })
}


module.exports = {
  bodyParser: require('body-parser'),
  helmet: require('helmet')(),
  requestId,
  errors
}
