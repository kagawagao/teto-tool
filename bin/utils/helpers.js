var fs = require('fs')
var path = require('path')

function isEmptyDir (dir) {
  try {
    var files = fs.readdirSync(dir)
    return !files.length
  } catch (e) {
    throw e
  }
}

module.exports = {
  isEmptyDir: isEmptyDir
}
