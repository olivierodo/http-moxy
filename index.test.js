beforeEach(() => {
  jest.resetModules()
})

describe('#index', () => {
  test('iniitialize with default options', () => {
    const AnyProxy = require('anyproxy')
    jest.mock('anyproxy')
    const mocks = {
      on: jest.fn(),
      start: jest.fn(),
      webServerUse: jest.fn()
    }
    AnyProxy.ProxyServer = jest.fn(() => {
      return {
        on: mocks.on,
        start: mocks.start,
        webServerInstance: {
          app: {
            use: mocks.webServerUse
          }
        }
      }
    })

    const rules = require('./server/rules')
    jest.mock('./server/rules')

    const routes = require('./server/routes')
    jest.mock('./server/routes')

    require('./index')

    const expectedOptions = {
      port: 8080,
      rule: rules,
      webInterface: {
        enable: true,
        webPort: 8000
      },
      throttle: 10000,
      forceProxyHttps: true,
      wsIntercept: false,
      silent: false,
      mqtt: {
        host: 'host.docker.internal',
        topic: 'restqa/api/moxy'
      }
    }

    expect(AnyProxy.ProxyServer.mock.calls.length).toEqual(1)
    expect(AnyProxy.ProxyServer.mock.calls[0][0]).toEqual(expectedOptions)
    expect(AnyProxy.ProxyServer.mock.instances.length).toEqual(1)
    expect(mocks.on.mock.calls.length).toEqual(2)
    expect(mocks.on.mock.calls[0][0]).toEqual('ready')
    expect(mocks.on.mock.calls[0][1]).toBeInstanceOf(Function)
    mocks.on.mock.calls[0][1].apply()
    expect(mocks.on.mock.calls[1][0]).toEqual('error')
    expect(mocks.on.mock.calls[1][1]).toBeInstanceOf(Function)
    mocks.on.mock.calls[1][1].apply()
    expect(mocks.start.mock.calls.length).toEqual(1)
    expect(mocks.start.mock.calls[0][0]).toBeUndefined()
    expect(mocks.webServerUse.mock.calls.length).toEqual(1)
    expect(mocks.webServerUse.mock.calls[0][0]).toEqual('/requests')
    expect(mocks.webServerUse.mock.calls[0][1]).toEqual(routes)
  })

  test('iniitialize with shared options', () => {
    process.env.PROXY_PORT = 1111
    process.env.ADMIN_PORT = 2222

    const AnyProxy = require('anyproxy')
    jest.mock('anyproxy')
    const mocks = {
      on: jest.fn(),
      start: jest.fn(),
      webServerUse: jest.fn()
    }
    AnyProxy.ProxyServer = jest.fn(() => {
      return {
        on: mocks.on,
        start: mocks.start,
        webServerInstance: {
          app: {
            use: mocks.webServerUse
          }
        }
      }
    })

    const rules = require('./server/rules')
    jest.mock('./server/rules')

    const routes = require('./server/routes')
    jest.mock('./server/routes')

    require('./index')

    const expectedOptions = {
      port: '1111',
      rule: rules,
      webInterface: {
        enable: true,
        webPort: '2222'
      },
      throttle: 10000,
      forceProxyHttps: true,
      wsIntercept: false,
      silent: false,
      mqtt: {
        host: 'host.docker.internal',
        topic: 'restqa/api/moxy'
      }
    }

    expect(AnyProxy.ProxyServer.mock.calls.length).toEqual(1)
    expect(AnyProxy.ProxyServer.mock.calls[0][0]).toEqual(expectedOptions)
    expect(AnyProxy.ProxyServer.mock.instances.length).toEqual(1)
    expect(mocks.on.mock.calls.length).toEqual(2)
    expect(mocks.on.mock.calls[0][0]).toEqual('ready')
    expect(mocks.on.mock.calls[0][1]).toBeInstanceOf(Function)
    expect(mocks.on.mock.calls[1][0]).toEqual('error')
    expect(mocks.on.mock.calls[1][1]).toBeInstanceOf(Function)
    expect(mocks.start.mock.calls.length).toEqual(1)
    expect(mocks.start.mock.calls[0][0]).toBeUndefined()
    expect(mocks.webServerUse.mock.calls.length).toEqual(1)
    expect(mocks.webServerUse.mock.calls[0][0]).toEqual('/requests')
    expect(mocks.webServerUse.mock.calls[0][1]).toEqual(routes)
  })
})
