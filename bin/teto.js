#!/usr/bin/env node --harmony
var program = require('commander')

/**
 * Usage
 */

program
  .version(require('../package').version)
  .usage('<command> [options]')
  .command('init', 'create a new project from a repository')
  .command('list', 'list recommend repository')
  .command('i18n', 'get text to be translated')
  .parse(process.argv)
