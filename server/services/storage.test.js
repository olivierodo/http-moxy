beforeEach(() => {
  jest.resetModules()
})

describe('#Services - storage', () => {
  test('Number of methods', () => {
    expect(Object.keys(require('./storage'))).toEqual(['get', 'put'])
  })

  describe('Get', () => {
    test('Get data from storage when key is a valid string', () => {
      const cache = require('memory-cache')
      jest.mock('memory-cache')

      cache.get = jest.fn().mockReturnValue('hello world')

      const Storage = require('./storage')
      const result = Storage.get('k')

      expect(cache.get.mock.calls.length).toBe(1)
      expect(cache.get.mock.calls[0][0]).toEqual('k')
      expect(result).toBe('hello world')
    })

    test('Get data from storage when key is not a string', () => {
      const cache = require('memory-cache')

      const Storage = require('./storage')
      expect(() => {
        Storage.get({})
      }).toThrow('The storage key has to be a string')
      expect(cache.get.mock.calls.length).toBe(0)
    })
  })

  describe('Put', () => {
    test('Put data from storage when key is a valid string', () => {
      const cache = require('memory-cache')
      jest.mock('memory-cache')

      cache.put = jest.fn().mockReturnValue('hello world')

      const Storage = require('./storage')
      const result = Storage.put('key', { foo: 'bar' }, 100)

      expect(cache.put.mock.calls.length).toBe(1)
      expect(cache.put.mock.calls[0][0]).toEqual('key')
      expect(cache.put.mock.calls[0][1]).toEqual({ foo: 'bar' })
      expect(cache.put.mock.calls[0][2]).toEqual(100)
      expect(result).toBe('hello world')
    })

    test('Get data from storage when key is not a string', () => {
      const cache = require('memory-cache')

      const Storage = require('./storage')
      expect(() => {
        Storage.put({}, { foo: 'bar' }, 100)
      }).toThrow('The storage key has to be a string')
      expect(cache.put.mock.calls.length).toBe(0)
    })

    test('Get data from storage when ttl is not a number', () => {
      const cache = require('memory-cache')

      const Storage = require('./storage')
      expect(() => {
        Storage.put('key', { foo: 'bar' }, '100')
      }).toThrow('The storage ttl has to be a number')
      expect(cache.put.mock.calls.length).toBe(0)
    })
  })
})
