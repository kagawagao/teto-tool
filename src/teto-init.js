#!/usr/bin/env node --harmony

import download from 'download-git-repo'
import program from 'commander'
import fs from 'fs-extra'
import chalk from 'chalk'
import co from 'co'
import coPrompt from 'co-prompt'
// import {execSync as exec} from 'child_process'
// import prompt from 'prompt-for-patched'
import { isEmptyDir, isND } from './utils/helpers'

/**
 * Usage
 */

program
  .usage('[project-name] [source-name]')

/**
 * Help
 */

program.on('--help', () => {
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
process.on('exit', () => {
  console.log()
})

let rawName = program.args[0]
let sourceName = 'crossjs/plato'
let dest = process.cwd()
let directoryName = ''
/**
 * start
 */
async function start () {
  if (await isND()) {
    sourceName = 'gitlab:http://git.sdp.nd:fed/ae-boilerplate'
  }
  if (program.args[1]) {
    sourceName = program.args[1]
  }
  if (rawName && rawName.indexOf('/') !== -1) {
    sourceName = rawName
    rawName = undefined
  }

  directoryName = sourceName.split('/')[1].split('#')[0]

  if (rawName) {
    console.log(chalk.yellow('You are creating a new project named %s based on %s'),
      rawName, sourceName)
  } else {
    console.log(chalk.yellow('You are creating a new project based on %s'), sourceName)
  }
  run()
}

/**
 * Clone
 */

function run () {
  if (!isEmptyDir(dest)) {
    console.log()
    console.log(chalk.blue('Current directory is not empty, project will created as a child directory named as %s'), rawName || directoryName)
    dest += '/'
    dest += rawName || directoryName
  } else {
    console.log()
    console.log(chalk.blue('Current directory is empty, project will be created in current directory'))
  }
  // if (fs.existsSync(dest)) {
  //   throw new Error('directory exist, please check')
  // }
  console.log()
  console.log(chalk.yellow('Downloading······'))
  download(sourceName, dest, {
    clone: false
  }, (err) => {
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

function writePackageJSON () {
  const filePath = dest + '/package.json'
  const pkg = require(filePath)
  const projectName = rawName || directoryName
  co(function * () {
    pkg.name = yield coPrompt('name(' + projectName + '): ')
    if (!pkg.name) {
      pkg.name = projectName
    }
    pkg.version = yield coPrompt('version(0.0.0): ')
    if (!pkg.version) {
      pkg.version = '0.0.0'
    }
    pkg.description = yield coPrompt('description: ')
    fs.writeJson(filePath, pkg, {
      spaces: 2
    }, (err) => {
      if (err) {
        throw err
      }
      console.log(chalk.yellow('Success!!!'))
      process.exit(0)
    })
    // prompt({
    //   ok: {
    //     type: 'boolean',
    //     default: true,
    //     label: 'install packages now ? '
    //   }
    // }, (err, answers) => {
    //   if (err) {
    //     throw err
    //   }
    //   if (answers.ok) {
    //     console.log()
    //     console.log(chalk.yellow('waiting·······'))
    //     console.log()
    //     exec('npm install')
    //     console.log()
    //   } else {
    //     console.log(chalk.yellow('Success!!!'))
    //   }
    // })
  })
}

start()
