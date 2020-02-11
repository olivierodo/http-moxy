beforeEach(() => {
  jest.resetModules()
})

describe('#Controller', () => {
  test('Object initialization', () => {
    const controllers = require('./controllers')
    expect(Object.keys(controllers)).toEqual(['getRequest', 'createRequest'])
  })

  describe('getRequest', () => {
    test('Return the object from the storage', () => {
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      Storage.get.mockReturnValue('test')

      const req = {
        params: {
          id: 'key'
        }
      }

      const res = {
        json: jest.fn()
      }

      const controllers = require('./controllers')
      controllers.getRequest(req, res)

      expect(Storage.get.mock.calls.length).toBe(1)
      expect(Storage.get.mock.calls[0][0]).toEqual('key')
      expect(res.json.mock.calls[0][0]).toEqual('test')
    })

    test('Return the empty object when there is nothing in the storage', () => {
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      Storage.get.mockReturnValue(null)

      const req = {
        params: {
          id: 'key'
        }
      }

      const res = {
        json: jest.fn()
      }

      const controllers = require('./controllers')
      controllers.getRequest(req, res)

      expect(Storage.get.mock.calls.length).toBe(1)
      expect(Storage.get.mock.calls[0][0]).toEqual('key')
      expect(res.json.mock.calls[0][0]).toEqual({})
    })
  })

  describe('createRequest', () => {
    test('Error when the mock\'s statusCode is not defined', () => {
      const req = {
        body: {
          mock: {
          }
        }
      }

      const res = {
        json: jest.fn()
      }

      const next = jest.fn()

      const controllers = require('./controllers')
      controllers.createRequest(req, res, next)

      expect(next.mock.calls.length).toBe(1)
      expect(next.mock.calls[0][0]).toEqual('The request body should include the \'mock.statusCode\' propery')
    })

    test('Error when the mock\'s header is not defined', () => {
      const req = {
        body: {
          mock: {
            statusCode: 200
          }
        }
      }

      const res = {
        json: jest.fn()
      }

      const next = jest.fn()

      const controllers = require('./controllers')
      controllers.createRequest(req, res, next)

      expect(next.mock.calls.length).toBe(1)
      expect(next.mock.calls[0][0]).toEqual('The request body should include the \'mock.header\' propery')
    })

    test('Error when the mock\'s body is not defined', () => {
      const req = {
        body: {
          mock: {
            statusCode: 403,
            header: {
              foo: 'bar'
            }
          }
        }
      }

      const res = {
        json: jest.fn()
      }

      const next = jest.fn()

      const controllers = require('./controllers')
      controllers.createRequest(req, res, next)

      expect(next.mock.calls.length).toBe(1)
      expect(next.mock.calls[0][0]).toEqual('The request body should include the \'mock.body\' propery')
    })

    test('Success case', () => {
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      const req = {
        params: {
          id: 'req-id'
        },
        body: {
          mock: {
            statusCode: 403,
            header: {
              foo: 'bar'
            },
            body: 'Forbidden'
          }
        }
      }

      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn()

      const next = jest.fn()

      const controllers = require('./controllers')
      controllers.createRequest(req, res, next)

      expect(next.mock.calls.length).toBe(0)
      expect(Storage.put.mock.calls[0][0]).toEqual('req-id')
      const expectedRequest = {
        id: 'req-id',
        mock: {
          statusCode: 403,
          header: {
            foo: 'bar'
          },
          body: 'Forbidden'
        }
      }
      expect(Storage.put.mock.calls[0][1]).toEqual(expectedRequest)
      expect(Storage.put.mock.calls[0][2]).toEqual(600000)
      expect(res.status.mock.calls[0][0]).toEqual(201)
      expect(res.json.mock.calls[0][0]).toEqual(expectedRequest)
    })
  })
})
