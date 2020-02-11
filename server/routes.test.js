beforeEach(() => {
  jest.resetModules()
})

describe('#routes', () => {
  test('load routes', () => {
    jest.mock('express')

    const Controllers = require('./controllers')
    jest.mock('./controllers')

    const Middlewares = require('./middlewares')
    jest.mock('./middlewares')

    Controllers.inspect = 'c.inspect'
    Controllers.mock = 'c.mock'

    Middlewares.requestId = 'mw.reqId'

    const Routes = require('./routes')

    expect(Routes.get.mock.calls.length).toBe(1)
    expect(Routes.get.mock.calls[0]).toEqual(['/_/:id', 'c.inspect'])

    expect(Routes.all.mock.calls.length).toBe(1)
    expect(Routes.all.mock.calls[0]).toEqual(['*', 'mw.reqId', 'c.mock'])
  })
})
