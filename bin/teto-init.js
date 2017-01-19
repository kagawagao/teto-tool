#!/usr/bin/env node --harmony

var download = require('download-git-repo')
var program = require('commander')
var fs = require('fs-extra')
var path = require('path')
var chalk = require('chalk')
var co = require('co')
var coPrompt = require('co-prompt')
var exec = require('child_process').execSync
var prompt = require('prompt-for-patched')
var isEmptyDir = require('./utils/helpers').isEmptyDir

/**
 * Usage
 */

program
  .usage('[project-name] [source-name]')

/**
 * Help
 */

program.on('--help', function() {
  console.log('  Examples:')
  console.log()
  console.log(chalk.yellow('  #create a new project with crossjs/plato'))
  console.log('   $ teto init my-project   ')
  console.log()
  console.log(chalk.yellow(
    '  #create a new project with another github repo'))
  console.log(
    '  $ teto init smart-india davezuko/react-redux-starter-kit   ')
  console.log()
})

program.parse(process.argv)
// if (program.args.length < 1) {
//   return program.help()
// }


/**
 * Padding
 */

console.log()
process.on('exit', function() {
  console.log()
})

/**
 * Setting
 */

var rawName = program.args[0]
var sourceName = 'crossjs/plato'
var dest = process.cwd()
if (program.args[1]) {
  sourceName = program.args[1]
}
if (rawName && rawName.indexOf('/') !== -1) {
  sourceName = rawName
  rawName = undefined
}
if (rawName) {
  console.log(chalk.yellow('You are creating a new project named %s based on %s'),
    rawName, sourceName)
} else {
  console.log(chalk.yellow('You are creating a new project based on %s'), sourceName)
}
run()


/**
 * Clone
 */

function run() {
  if (!isEmptyDir(dest)) {
    console.log()
    console.log(chalk.blue('Current directory is not empty, project will created as a child directory named as %s'), rawName || sourceName)
    dest += '/'
    dest += rawName || sourceName
  } else {
    console.log()
    console.log(chalk.blue('Current directory is empty, project will be created in current directory'))
  }
  if (fs.existsSync(dest)) {
    throw new Error('directory exist, please check')
    process.exit(1)
  }
  console.log()
  console.log(chalk.yellow('Downloading······'))
  download(sourceName, dest, {
    clone: false
  }, function(err) {
    if (err) {
      throw err
    }
    console.log(chalk.yellow('Download success!!!'))
    writePackageJSON()
  })
}

/**
 * Write
 */

function writePackageJSON() {
  var filepath = dest + '/package.json'
  var pkg = require(filepath)
  var projectName = rawName || sourceName
  co(function*() {
    pkg.name = yield coPrompt('name(' + projectName + '): ')
    if (!pkg.name) {
      pkg.name = projectName
    }
    pkg.version = yield coPrompt('version(0.0.0): ')
    if (!pkg.version) {
      pkg.version = '0.0.0'
    }
    pkg.description = yield coPrompt('description: ')
    fs.writeJsonSync(filepath, pkg, {
      spaces: 2
    }, function(err) {
      if (err) {
        throw err
      }
    })
    prompt({
      ok: {
        type: 'boolean',
        default: true,
        label: 'install packages now ? '
      }
    }, function(err, answers) {
      if (err) {
        throw err
      }
      if (answers.ok) {
        console.log()
        console.log(chalk.yellow('waiting·······'))
        console.log()
        exec('npm install')
        console.log()
      } else {
        console.log(chalk.yellow('Success!!!'))
      }
    })
  })
}
