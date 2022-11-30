const NodeCache = require('node-cache')
const cache = new NodeCache()
const configVars = require('../config')

const cache_enabled = configVars.cache_enabled
const cache_expiry_time_seconds = configVars.cache_timer_seconds

console.log(`cache status ${cache_enabled}, with expiry time ${cache_expiry_time_seconds}`)

module.exports = {
  SetKey: function (key, data_obj, expiry_time_seconds = cache_expiry_time_seconds) {
    if (cache_enabled) {
      cache.set(key, data_obj, expiry_time_seconds)
      console.log(`cache value set for key ${key}`)
    }
    return false
  },

  GetKey: function (key) {
    if (cache_enabled) {
      value = cache.get(key)
      if (value == undefined) {
        console.log(`couldn't find value for key ${key}...`)
        return false
      } else {
        console.log(`cache found value for key ${key}`)
        return value
      }
    }
    console.log(`cache disabled, skipping...`)
    return false
  }
}
