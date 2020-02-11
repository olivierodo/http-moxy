const AnyProxy = require('anyproxy')

const options = {
  port: process.env.PROXY_PORT || 8080,
  rule: require('./server/rules'),
  webInterface: {
    enable: true,
    webPort: process.env.ADMIN_PORT || 8000
  },
  throttle: 10000,
  forceProxyHttps: true,
  wsIntercept: false,
  silent: false
}
const proxyServer = new AnyProxy.ProxyServer(options)

proxyServer.on('ready', () => {
  console.log('ready')
})
proxyServer.on('error', () => { /* */ })
proxyServer.start() // Starting the proxy server

proxyServer.webServerInstance.app.use('/requests', require('./server/routes')) // Adding custom routes to the admin interface
