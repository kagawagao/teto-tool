#!/usr/bin/env node --harmony

import chalk from 'chalk'
import { isND } from './utils/helpers'

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
isND().then(res => {
  if (res) {
    console.log(chalk.yellow('fed/ae-boilerplate'))
    console.log()
  }
  console.log(chalk.yellow('crossjs/plato'))
  console.log()
  console.log(chalk.yellow('tetojs/teto.js'))
  console.log()
  console.log(chalk.yellow('davezuko/react-redux-starter-kit'))
  console.log()
})
