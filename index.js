global.$ = {
  config: {
    port: 8080
  }
}

const http = require('http')
  .createServer(require('./server/app'))
  .listen($.config.port, () => {
    // $.log.info('Running server on :' + $.config.port)
    // $.readiness.signalReady()
  })

process.on('SIGTERM', () => {
  // $.log.info('Received SIGTERM. Exiting')
  http && http.close(() => process.exit(0))
})

process.on('uncaughtException', (err) => {
  // $.log.info('Received uncaughtException. Exiting')
  // $.log.info(err.stack)
  console.log(err)
  http && http.close(() => process.exit(1))
})
