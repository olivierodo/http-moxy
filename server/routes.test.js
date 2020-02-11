beforeEach(() => {
  jest.resetModules()
})

describe('#routes', () => {
  test('load routes', () => {
    jest.mock('express')

    const Controllers = require('./controllers')
    jest.mock('./controllers')

    Controllers.getRequest = 'c.getRequest'
    Controllers.createRequest = 'c.createRequest'

    const Routes = require('./routes')

    expect(Routes.get.mock.calls.length).toBe(1)
    expect(Routes.get.mock.calls[0]).toEqual(['/:id', 'c.getRequest'])

    expect(Routes.post.mock.calls.length).toBe(1)
    expect(Routes.post.mock.calls[0]).toEqual(['/:id', 'c.createRequest'])

    expect(Routes.all.mock.calls.length).toBe(0)
    expect(Routes.put.mock.calls.length).toBe(0)
    expect(Routes.patch.mock.calls.length).toBe(0)
    expect(Routes.options.mock.calls.length).toBe(0)
    expect(Routes.head.mock.calls.length).toBe(0)
    expect(Routes.delete.mock.calls.length).toBe(0)
  })
})
