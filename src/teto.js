#!/usr/bin/env node --harmony
import program from 'commander'
import pkg from '../package.json'

/**
 * Usage
 */

program
  .version(pkg.version)
  .usage('<command> [options]')
  .command('init', 'create a new project from a repository')
  .command('list', 'list recommend repository')
  .command('i18n', 'get text to be translated')
  .parse(process.argv)
