beforeEach(() => {
  jest.resetModules()
  delete process.env.HEADER_REQUEST_ID_PROPERTY
  global.options = {}
})

describe('#Services - storage', () => {
  test('Object initialization', () => {
    const rules = require('./rules')
    expect(Object.keys(rules)).toEqual(['summary', 'beforeSendRequest', 'beforeSendResponse'])
    expect(rules.summary).toEqual('Custom rule restQa')
    expect(rules.beforeSendRequest).toBeInstanceOf(Function)
    expect(rules.beforeSendResponse).toBeInstanceOf(Function)
  })

  describe('beforeSendRequest', () => {
    test('Return null when the "request-id" is not found in the header', () => {
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      const req = {
        requestOptions: {
          headers: {
          }
        }
      }

      const rules = require('./rules')
      const result = rules.beforeSendRequest(req)

      expect(result.next().value).toBeNull()
      expect(Storage.get.mock.calls.length).toBe(0)
      expect(Storage.put.mock.calls.length).toBe(0)
    })

    test('Return null when the request is not found in the storage but the header to check is not the default one', () => {
      process.env.HEADER_REQUEST_ID_PROPERTY = 'foo'
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      Storage.get.mockReturnValue(null)

      const req = {
        requestOptions: {
          headers: {
            foo: 'foo'
          }
        }
      }

      const rules = require('./rules')
      const result = rules.beforeSendRequest(req)

      expect(result.next().value).toBeNull()
      expect(Storage.get.mock.calls.length).toBe(1)
      expect(Storage.get.mock.calls[0][0]).toBe('foo')
      expect(Storage.put.mock.calls.length).toBe(0)
    })

    test('Return null when the request is not found in the storage', () => {
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      Storage.get.mockReturnValue(null)

      const req = {
        requestOptions: {
          headers: {
            'x-request-id': 'hello-555'
          }
        }
      }

      const rules = require('./rules')
      const result = rules.beforeSendRequest(req)

      expect(result.next().value).toBeNull()
      expect(Storage.get.mock.calls.length).toBe(1)
      expect(Storage.get.mock.calls[0][0]).toBe('hello-555')
      expect(Storage.put.mock.calls.length).toBe(0)
    })

    test('Return the mock when the request is found in the storage', () => {
      const Storage = require('./services/storage')
      jest.mock('./services/storage')

      Storage.get.mockReturnValue({
        id: 'hello-555',
        mock: {
          statusCode: 404,
          header: {
            'x-foo': 'bar'
          },
          body: 'Not Found'
        }
      })

      const req = {
        requestOptions: {
          method: 'POST',
          hostname: 'test.qa.local',
          path: '/',
          headers: {
            'x-request-id': 'hello-555'
          }
        },
        requestData: Buffer.from('hello world', 'utf8')
      }

      const rules = require('./rules')
      const result = rules.beforeSendRequest(req)

      expect(result.next().value).toEqual({
        response: {
          statusCode: 404,
          header: {
            'x-foo': 'bar'
          },
          body: 'Not Found'
        }
      })

      expect(Storage.get.mock.calls.length).toBe(1)
      expect(Storage.get.mock.calls[0][0]).toBe('hello-555')
      expect(Storage.put.mock.calls.length).toBe(1)
      const expectedRequest = {
        id: 'hello-555',
        method: 'POST',
        url: 'test.qa.local',
        path: '/',
        headers: {
          'x-request-id': 'hello-555'
        },
        body: 'hello world',
        mock: {
          statusCode: 404,
          header: {
            'x-foo': 'bar'
          },
          body: 'Not Found'
        }
      }
      expect(Storage.put.mock.calls[0][0]).toEqual('hello-555')
      expect(Storage.put.mock.calls[0][1]).toEqual(expectedRequest)
      expect(Storage.put.mock.calls[0][2]).toEqual(600000)
    })
  })

  describe('beforeSendResponse', () => {
    test('Send message to broker', () => {
      const Broker = require('./services/broker')
      jest.mock('./services/broker')

      Broker.publish = jest.fn()

      const req = {
        requestOptions: {
          foo: 'bar'
        },
        requestData: 'test-body'
      }

      const res = {
        response: {
          statusCode: 200,
          header: 'headers',
          body: 'responseBody'
        }
      }

      const rules = require('./rules')
      const result = rules.beforeSendResponse(req, res)

      expect(result.next().value).toBeUndefined()
      expect(Broker.publish.mock.calls.length).toBe(1)
      const expectedMsg = {
        request: {
          foo: 'bar',
          body: Buffer.from('test-body').toString('utf-8')
        },
        response: {
          statusCode: 200,
          header: 'headers',
          body: 'responseBody'.toString('utf-8')
        }
      }
      expect(Broker.publish.mock.calls[0][0]).toEqual(expectedMsg)
    })
  })
})
