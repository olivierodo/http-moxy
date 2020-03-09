const MQTT = require('mqtt')

const globalOptions = (global.options && global.options.mqtt) || {}

module.exports = {
  client: MQTT.connect(`mqtt://${globalOptions.host}`),
  options: {
    properties: {
      contentType: 'application/json',
      messageExpiryInterval: 3600
    }
  },
  publish: function (msg) {
    try {
      if (this.client.connected) {
        this.client.publish(globalOptions.topic, JSON.stringify(msg), this.options)
      } else {
        console.log('Broker is not connected')
      }
    } catch (e) {
      console.log(e)
    }
  }
}
