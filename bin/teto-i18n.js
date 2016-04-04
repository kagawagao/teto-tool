#!/usr/bin/env node --harmony

var chalk = require('chalk')
var path = require('path')
var fs = require('fs-extra')
var rootPath = process.cwd()

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
  fs.close(fs.openSync(rootPath + '/package.json', 'r'))
} catch (e) {
  console.dir(e)
  console.log(chalk.red('Cannot find package.json, please check your file path!'))
  process.exit(0)
}


/**
** get config.
**/
var config
try {
  var config = fs.readJsonSync(rootPath + '/.i18n')
} catch (e) {
  console.dir(e)
  console.log(chalk.red('Cannot find config file named as .i18n, please check!'))
  process.exit(0)
}
var path_src = config.path_src
var path_i18n = config.path_i18n
var languages = config.languages
var include_files = config.include_files
var exclude_files = config.exclude_files
var i18n_helper = config.i18n_helper
// var default_data = config.default_data
// if (typeof default_data === 'string') {
//   default_data =
// }
if (!path_src || !path_i18n || !languages || !i18n_helper) {
  console.log(chalk.red('Your config maybe wrong, please check!'))
  process.exit(0)
}
console.log(chalk.yellow('Your config:'))
console.log()
console.log(chalk.yellow('  i18n_helper: ', i18n_helper))
console.log(chalk.yellow('  path_src: ', path_src))
console.log(chalk.yellow('  path_i18n: ', path_i18n))
console.log(chalk.yellow('  languages: ', languages.join(' ')))
if (include_files) {
  console.log(chalk.yellow('  include_files: ', include_files.join(' ')))
}
console.log()
console.log(chalk.yellow('start now ~~~'))
console.log()
var date = Date.now()
var translateData = {}
languages.map(function(language) {
  var distFilePath = rootPath + '/' + path_i18n + '/' + language + '.json'
  try {
    fs.ensureFileSync(distFilePath)
    translateData[language] = fs.readJsonSync(distFilePath, {throws: false})
    if (!translateData[language]) {
      translateData[language] = {}
    }
  } catch (e) {
    console.dir(e)
  }
})

readAllFiles(rootPath + '/' + path_src, function(err, files) {
  if (err) {
    console.dir(err)
    console.log(chalk.red('There is something wrong, please check!'))
    process.exit(0)
  }
  var translateFiles = []
  files.map(function(file, index) {
    if (include_files) {
      var extname = path.extname(file)
      if (include_files.indexOf(extname) !== -1) {
        translateFiles.push(file)
      }
    }
  })
  translateFiles.map(function(file, index) {
    var contents = fs.readFileSync(file, 'utf8')
    var reg = new RegExp("i18n\\(((('(.+?)'))|((\"(.+?))\"))\\)", 'gm')
    var matched = contents.match(reg)
    if (matched) {
      matched.map(function(item, index) {
        var key = item.replace(/i18n\(((')|("))/, '').replace(/((')|("))\)/, '')
        languages.map(function(language) {
          if (!translateData[language].hasOwnProperty(key)) {
            translateData[language][key] = key
          }
        })
      })
    }
  })
  languages.map(function(language) {
    var distFilePath = rootPath + '/' + path_i18n + '/' + language + '.json'
    fs.writeJsonSync(distFilePath, translateData[language], {spaces: 2}, function(err) {
      if (err) {
        console.dir(err)
        process.exit(0)
      }
    })
  })
  var time = (Date.now() - date) / 1000
  console.log(chalk.yellow('Done in ' + time + 'ms!!!'))
})

/**
** get all files in path_src.
**/
function readAllFiles(dir, callback) {
  var results = []
  fs.readdir(dir, function(err, list) {
    if (err) return callback(err)
    var pending = list.length
    if (!pending) return callback(null, results)
    list.forEach(function(file) {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          readAllFiles(file, function(err, res) {
            results = results.concat(res)
            if (!--pending) callback(null, results)
          });
        } else {
          results.push(file);
          if (!--pending) callback(null, results)
        }
      })
    })
  })
}
