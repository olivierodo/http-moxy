const cache = require('memory-cache')

function get (key) {
  if (typeof key !== 'string') throw new Error('The storage key has to be a string')
  return cache.get(key)
}

function put (key, obj, ttl) {
  if (typeof key !== 'string') throw new Error('The storage key has to be a string')
  if (typeof ttl !== 'number') throw new Error('The storage ttl has to be a number')
  return cache.put(key, obj, ttl)
}

module.exports = {
  get,
  put
}
