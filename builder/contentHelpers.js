const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const handlebars = require('handlebars')
const showdown = require('showdown')

const mdConverter = new showdown.Converter()

// File Helpers
var contentOf = exports.contentOf = filename => fs.readFileSync(filename, 'utf8')
exports.hashOfFile = filename => crypto.createHmac('sha1', 'not-very-secret').update(contentOf(filename)).digest('hex')
exports.writeFile = function (filename, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, content, err => { 
            if(err) reject(err)
            else resolve()
        })
    })
}

// Handlebars helpers
exports.templateOf = filename => handlebars.compile(contentOf(filename))

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
