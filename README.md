# teto-tool

[![npm](https://img.shields.io/npm/v/teto-tool.svg)](https://www.npmjs.com/package/teto-tool)
[![license](https://img.shields.io/npm/l/teto-tool.svg)](https://github.com/kagawagao/teto-tool/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/kagawagao/teto-tool.svg?branch=master)](https://travis-ci.org/kagawagao/teto-tool)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Overall Score](https://www.bithound.io/github/kagawagao/teto-tool/badges/score.svg)](https://www.bithound.io/github/kagawagao/teto-tool)
[![bitHound Dependencies](https://www.bithound.io/github/kagawagao/teto-tool/badges/dependencies.svg)](https://www.bithound.io/github/kagawagao/teto-tool/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/kagawagao/teto-tool/badges/devDependencies.svg)](https://www.bithound.io/github/kagawagao/teto-tool/master/dependencies/npm)

 A tool, but more

## Install

```bash
$ npm install teto-tool -g
```

## Use

- generate a new project

```bash
$ teto init [dest] [source]
```
Source: {gitUsername}/{repo}, you can find more in [download-git-repo](https://github.com/flipxfx/download-git-repo)

You can specify a repository to create a new project, the default repository is [crossjs/plato](https://github.com/crossjs/plato)

- list some templates

```bash
$ teto list
```

- get text to be translated

```bash
$ teto i18n
```
## How to use `$ teto i18n`?

You just need to create a file named as `.i18n` in your project root path, config like this:

```javascript
{
  "path_src": "src",
  "path_i18n": "src/i18n",
  "languages": ["zh-CN", "en-US", "th"],
  "include_files": [".js", ".jsx"],
  "i18n_helper": "i18n",
  "default_data": "src/error.json"
}
```
Explanations:
- path_src: Your source file's path, generally, it is a relative path
- path_i18n: The path you place the i18n JSON files
- languages: languages
- include_files: files extention, if you do not set it, it will find all the files under the path_src
- i18n_helper: a symbol to mark the string which should be translated, like: i18n('xxxx')
- default_data: default data, it can be an object or a file path

## Which repository can be used?

Generally, you can use any one as your template, but we recommend following these:

- React-Redux

  - [tetojs/teto.js](https://github.com/tetojs/teto.js)
  - [davezuko/react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)

- Vue-Vuex

  - [crossjs/plato](https://github.com/crossjs/plato)
