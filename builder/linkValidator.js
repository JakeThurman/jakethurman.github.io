const fs = require('fs')
const path = require('path')
const markdownLinkExtractor = require('markdown-link-extractor')
const { contentOf } = require('./contentHelpers')

// Checks if a url is an absolute path
const isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');

// Helper to flatten nested lists
const flatten = xs => xs.reduce((x,y) => x.concat(y), [])

exports.validateAndPrint = function (mdFileNames, inputPath, localizeLink) {
	let mdFileData = mdFileNames.map(source => ({
		source,
		links: markdownLinkExtractor(contentOf(path.join(inputPath, source)))
	}))

	let sourcedLocalLinks = flatten(mdFileData.map( data => 
		data.links
			.filter(link => !isAbsoluteUrl.test(link))
			.map(link => ({
				// These are relative to the file so check if 
				// they are valid from their actual location.
				link: link,
				source: data.source
			}))
	))

	let missingFiles = sourcedLocalLinks
		.map(data => localizeLink(data.source, data.link))
		.filter(link => !fs.existsSync(link))

	missingFiles.forEach(data => console.log(`Bad link to "${data.link}" in file ${data.source}`))

	return missingFiles.length == 0
}