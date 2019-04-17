const fs = require('fs')
const crypto = require('crypto')
const handlebars = require('handlebars')
const showdown = require('showdown')

const mdConverter = new showdown.Converter()

// File Helpers
var contentOf = exports.contentOf = filename => fs.readFileSync(filename, 'utf8')
var writeFile = exports.writeFile = (filename, content) => fs.writeFile(filename, content, err => { if(err) throw err })
exports.getAllOfTypeInDir = (dir, type) => fs.readdirSync(dir).filter(name => name.toLowerCase().endsWith("." + type.toLowerCase()))
exports.hashOfFile = filename => crypto.createHmac('sha1', 'not-very-secret').update(contentOf(filename)).digest('hex')

// Markdown, handlebars helpers
exports.htmlOfMD = mdFile => mdConverter.makeHtml(contentOf(mdFile))
exports.templateOf = filename => handlebars.compile(contentOf(filename))
exports.htmlWriter = (template) => (name, settings) => writeFile(name, template(settings))

