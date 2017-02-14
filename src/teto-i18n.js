#!/usr/bin/env node --harmony

import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'
import flattern, {unflatten} from 'flat'
import sortObecjt from 'deep-sort-object'

const rootPath = process.cwd()

/**
** Padding.
**/

console.log()
process.on('exit', function () {
  console.log()
  console.log()
})

/**
** check file path.
**/

try {
  fs.close(fs.openSync(path.resolve(rootPath, 'package.json'), 'r'))
} catch (e) {
  console.dir(e)
  console.log(chalk.red('Cannot find package.json, please check your file path!'))
  process.exit(0)
}

/**
** get config.
**/
let config
try {
  config = fs.readJsonSync(path.resolve(rootPath, '.i18n'))
} catch (e) {
  console.dir(e)
  console.log(chalk.red('Cannot find config file named as .i18n, please check!'))
  process.exit(0)
}
let pathSrc = config.path_src
let pathI18n = config.path_i18n
let languages = config.languages
let includeFiles = config.include_files
// let excludeFiles = config.exclude_files
let i18nHelper = config.i18n_helper
let defaultData = config.default_data || {}
// let default_language config.default_language

if (typeof defaultData === 'string') {
  try {
    defaultData = fs.readJsonSync(path.resolve(rootPath, defaultData))
  } catch (e) {
    defaultData = {}
    console.log(chalk.red('Cannot find default data in ' + defaultData + ', it will be an empty object'))
  }
} else if (Array.isArray(defaultData) || typeof defaultData === 'function') {
  console.log(chalk.red('Default data must be an object or a file path, please check!'))
}

if (!pathSrc || !pathI18n || !languages || !i18nHelper) {
  console.log(chalk.red('Your config maybe wrong, please check!'))
  process.exit(0)
}
if (!Array.isArray(languages) || languages.length === 0) {
  console.log(chalk.red('languages must be an array and it\'s length cannot less than 1, please check!'))
  process.exit(0)
}

// default_language = default_language || languages[0]

console.log(chalk.yellow('Your config:'))
console.log()
console.log(chalk.yellow('  i18n_helper     : ', i18nHelper))
console.log(chalk.yellow('  path_src        : ', pathSrc))
console.log(chalk.yellow('  path_i18n       : ', pathI18n))
console.log(chalk.yellow('  languages       : ', languages.join(' ')))
// console.log(chalk.yellow('  default_language: ', default_language))
if (includeFiles) {
  console.log(chalk.yellow('  include_files   : ', includeFiles.join(' ')))
}
console.log()
console.log(chalk.yellow('start now ~~~'))
console.log()
const start = Date.now()
const translateData = {}
const keys = []

languages.map(function (language) {
  const distFilePath = path.resolve(rootPath, pathI18n, language + '.json')
  try {
    fs.ensureFileSync(distFilePath)
    translateData[language] = fs.readJsonSync(distFilePath, {throws: false})
    if (!translateData[language]) {
      translateData[language] = {}
    }
    translateData[language] = flattern(translateData[language])
    defaultData = flattern(defaultData)
    Object.keys(defaultData).map(key => {
      keys.push(key)
      if (!translateData[language].hasOwnProperty(key)) {
        translateData[language][key] = defaultData[key]
      }
    })
  } catch (e) {
    console.dir(e)
  }
})

readDir(path.resolve(rootPath, pathSrc))

languages.map(function (language) {
  Object.keys(translateData[language]).map(function (key) {
    if (keys.indexOf(key) === -1) {
      delete translateData[language][key]
    }
  })
})

languages.map(function (language) {
  let distFilePath = path.resolve(rootPath, pathI18n, language + '.json')
  fs.writeJsonSync(distFilePath, sortObecjt(unflatten(translateData[language])), {spaces: 2}, function (err) {
    if (err) {
      console.dir(err)
      process.exit(0)
    }
  })
})

const time = (Date.now() - start) / 1000
console.log(chalk.yellow('Done in ' + time + 'ms!!!'))

/**
** get all files in path_src.
**/
function readDir (dir) {
  const list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = path.resolve(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      readDir(file)
    } else {
      if (includeFiles) {
        const extname = path.extname(file)
        if (includeFiles.indexOf(extname) !== -1) {
          hanldeFile(file)
        }
      }
    }
  })
}

function hanldeFile (file) {
  const contents = fs.readFileSync(file, 'utf8')
  const reg = new RegExp(i18nHelper + '\\((((\'.+?\'))|((".+?")))', 'gm')
  const matched = contents.match(reg)
  if (matched) {
    matched.map(function (item) {
      const key = item.match(/('.+?')|(".+?")/)[0].replace(/'|"/gm, '')
      languages.map(function (language) {
        if (keys.indexOf(key) === -1) {
          keys.push(key)
        }
        if (!translateData[language].hasOwnProperty(key)) {
          translateData[language][key] = key
        }
      })
    })
  }
}
