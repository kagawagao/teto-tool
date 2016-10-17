#!/usr/bin/env node --harmony

var chalk = require('chalk')

/**
 * Padding.
 */

console.log()
process.on('exit', function () {
  console.log()
})

/**
 * List repos.
 */

console.log(chalk.yellow('crossjs/plato'))
console.log()
console.log(chalk.yellow('tetojs/teto.js'))
console.log()
console.log(chalk.yellow('davezuko/react-redux-starter-kit'))
console.log()
