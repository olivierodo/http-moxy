const AnyProxy = require('anyproxy')

global.options = {
  port: process.env.PROXY_PORT || 8080,
  webInterface: {
    enable: true,
    webPort: process.env.ADMIN_PORT || 8000
  },
  throttle: 10000,
  forceProxyHttps: true,
  wsIntercept: false,
  silent: false,
  mqtt: {
    host: process.env.MQTT_HOST || 'host.docker.internal',
    topic: process.env.MQTT_TOPIC || 'restqa/api/moxy'
  }
}

options.rule = require('./server/rules')

const proxyServer = new AnyProxy.ProxyServer(options)

proxyServer.on('ready', () => {
  console.log('ready')
})
proxyServer.on('error', () => { /* */ })
proxyServer.start() // Starting the proxy server

proxyServer.webServerInstance.app.use('/requests', require('./server/routes')) // Adding custom routes to the admin interface
