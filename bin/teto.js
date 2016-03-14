#!/usr/bin/env node
var program = require('commander')

/**
 * Usage
 */

program
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('init', 'create a new project from teto')
  .parse(process.argv)
