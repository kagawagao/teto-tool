#!/usr/bin/env node --harmony

var download = require('download-git-repo')
var program = require('commander')
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var jsonfile = require('jsonfile')
var co = require('co')
var coPrompt = require('co-prompt')
var exec = require('child_process').execSync
var prompt  = require('prompt-for-patched')
var exists = fs.existsSync

/**
 * Usage
 */

program
  .usage('<project-name> [source-name]')

/**
 * Help
 */

program.on('--help', function () {
  console.log('  Examples:')
  console.log()
  console.log(chalk.yellow('  #create a new project with teto'))
  console.log('   $ teto init smart-india   ')
  console.log()
  console.log(chalk.yellow('  #create a new project with another github repo'))
  console.log('   $ teto init smart-india davezuko/react-redux-starter-kit   ')
  console.log()
})

program.parse(process.argv)
if (program.args.length < 1) {
  return program.help()
}


/**
 * Padding
 */

console.log()
process.on('exit', function () {
  console.log()
})

/**
 * Setting
 */

var rawName = program.args[0]
var sourceName = 'tetojs/teto.js'
if (program.args[1]) {
  sourceName = program.args[1]
}
console.log(chalk.yellow('You are creating a new project named %s from %s'), rawName, sourceName)
run()


/**
 * Clone
 */

function run () {
  var currentPath = process.cwd()
  var dest = './'
  console.log(chalk.yellow('Downloading······'))
  download(sourceName, dest, {clone: false}, function (err) {
    if (err) {
      throw err
    }
    console.log('Download success!!!')
    writePackageJSON()
  })
}

/**
 * Write
 */

function writePackageJSON () {
  var filepath = process.cwd() + '/package.json'
  var pkg = require(filepath)
  co(function *() {
    pkg.name = yield coPrompt('name(' + rawName + '):')
    if (!pkg.name) {
      pkg.name = rawName
    }
    pkg.version = yield coPrompt('version(0.0.0):')
    if (!pkg.version) {
      pkg.name = '0.0.0'
    }
    pkg.description = yield coPrompt('description:')
    jsonfile.writeFile(filepath, pkg, {spaces: 2}, function (err) {
      if (err) {
        throw err
      }
    })
    prompt({
      ok: {
        type: 'boolean',
        default: true,
        label: 'install packages now?'
      }
    }, function (err, answers) {
      if (err) {
        throw err
      }
    if (answers.ok) {
      console.log()
      console.log('waiting·······')
      console.log()
      exec('npm install')
      console.log()
      console.log('Install packages success!!!')
    } else {
    console.log('Success!!!')
    }
  })
}
