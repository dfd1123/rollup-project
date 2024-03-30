
'use strict'

if (process.env.npm_package_type === 'module') {
  module.exports = require('./modules.ems.js')
} else {
  module.exports = require('./modules.cjs.js')
}
