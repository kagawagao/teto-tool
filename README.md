# teto-tool

A tool for teto.js, but more

## Install

```bash
$ npm install teto-tool -g
```

## Use

- generate a new project

```bash
$ teto init [dest] [source]
```
Source: {gitUsername}/{repo}

You can specify a repository to create a new project, the default repository is [tetojs/teto.js](https://github.com/tetojs/teto.js)

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
  "i18n_helper": "i18n"
}
```
Explanations:
- path_src: Your source file's path, generally, it is a relative path
- path_i18n: The path you place the i18n JSON files
- languages: languages
- include_files: files extention, if you do not set it, it will find all the files under the path_src
- i18n_helper: a symbol to mark the string which should be translated, like: i18n('xxxx')

## Which repository can be used?

Generally, you can use any one as your template, but we recommend following these:

- ### React-Redux

  - [tetojs/teto.js](https://github.com/tetojs/teto.js)
  - [davezuko/react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)

- ### ND-Front

  - comming soon ~~~
