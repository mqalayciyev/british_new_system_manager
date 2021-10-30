
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-calendar.cjs.production.min.js')
} else {
  module.exports = require('./react-calendar.cjs.development.js')
}
