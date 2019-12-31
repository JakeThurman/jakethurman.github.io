const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const handlebars = require('handlebars')
const showdown = require('showdown')

const mdConverter = new showdown.Converter()

// File Helpers
var contentOf = exports.contentOf = filename => fs.readFileSync(filename, 'utf8')
var writeFile = exports.writeFile = (filename, content) => fs.writeFile(filename, content, err => { if(err) throw err })
exports.hashOfFile = filename => crypto.createHmac('sha1', 'not-very-secret').update(contentOf(filename)).digest('hex')

// Handlebars helpers
exports.templateOf = filename => handlebars.compile(contentOf(filename))
exports.htmlWriter = (template) => (name, settings) => writeFile(name, template(settings))

// Load files, and compile to html
exports.getCompiledContent = function (filePath) {
    let extension = path.extname(filePath).toLowerCase()

	switch (extension) {
		case ".html":
            return contentOf(filePath)
		case ".md":
            return mdConverter.makeHtml(contentOf(filePath))
    }
    
    throw new Error(`Unexpected file type: ${extension} [${filePath}]`)
}
