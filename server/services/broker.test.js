beforeEach(() => {
  jest.resetModules()
  delete global.options
  delete global.console
})

describe('#Services - broker', () => {
  test('Initial properties', () => {
    global.options = {
      mqtt: {
        host: 'test.com'
      }
    }
    const MQTT = require('mqtt')
    jest.mock('mqtt')

    MQTT.connect = jest.fn()

    const Broker = require('./broker')

    expect(Object.keys(Broker)).toEqual(['client', 'options', 'publish'])
    expect(Broker.options).toEqual({
      properties: {
        contentType: 'application/json',
        messageExpiryInterval: 3600
      }
    })
    expect(MQTT.connect.mock.calls.length).toBe(1)
    expect(MQTT.connect.mock.calls[0][0]).toBe('mqtt://test.com')
  })

  describe('#publish', () => {
    test('if the client is not connected', () => {
      global.options = {
        mqtt: {
          topic: 'topic/test'
        }
      }
      global.console = {
        log: jest.fn()
      }

      const client = {
        connected: false,
        publish: jest.fn()
      }

      const Broker = require('./broker')
      Broker.client = client

      Broker.publish({})

      expect(Broker.client.publish.mock.calls.length).toBe(0)
      expect(global.console.log.mock.calls.length).toBe(1)
      expect(global.console.log.mock.calls[0][0]).toBe('Broker is not connected')
    })

    test('if the client is connected', () => {
      global.options = {
        mqtt: {
          topic: 'topic/test'
        }
      }
      global.console = {
        log: jest.fn()
      }

      const client = {
        connected: true,
        publish: jest.fn()
      }

      const Broker = require('./broker')
      Broker.client = client
      Broker.options = {
        foo: 'bar'
      }

      Broker.publish({ hello: 'world' })

      expect(Broker.client.publish.mock.calls.length).toBe(1)
      expect(Broker.client.publish.mock.calls[0][0]).toEqual('topic/test')
      expect(Broker.client.publish.mock.calls[0][1]).toEqual(JSON.stringify({ hello: 'world' }))
      expect(Broker.client.publish.mock.calls[0][2]).toEqual(Broker.options)
      expect(global.console.log.mock.calls.length).toBe(0)
    })

    test('if it throws an error', () => {
      global.options = {
        mqtt: {
          topic: 'topic/test'
        }
      }
      global.console = {
        log: jest.fn()
      }

      const client = {
        connected: true,
        publish: jest.fn(() => {
          throw new Error('My Error')
        })
      }

      const Broker = require('./broker')
      Broker.client = client
      Broker.options = {
        foo: 'bar'
      }

      Broker.publish({ hello: 'world' })

      expect(Broker.client.publish.mock.calls.length).toBe(1)
      expect(global.console.log.mock.calls.length).toBe(1)
      expect(global.console.log.mock.calls[0][0]).toBeInstanceOf(Error)
      expect(global.console.log.mock.calls[0][0].message).toBe('My Error')
    })
  })
})
