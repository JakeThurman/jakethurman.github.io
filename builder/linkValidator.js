const fs = require('fs')
const path = require('path')
const markdownLinkExtractor = require('markdown-link-extractor')
const extractHref = require('extract-href');
const { contentOf } = require('./contentHelpers')

// Checks if a url is an absolute path
const isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');

// Helper to flatten nested lists
const flatten = xs => xs.reduce((x,y) => x.concat(y), [])

exports.getBadLinks = function (fileNames, inputPath, localizeLink) {
	let linksFromEachSource = fileNames.map(sourceFilePath => {
		// We call localize link becuase there are relative to the file they're from.
		//  and we want to check if they are valid from their final location.
		const getLinkData = linkedPath => ({ 
			source: sourceFilePath, 
			link: localizeLink(sourceFilePath, linkedPath) 
		})

		// Note that for now we're not validating any exernal links. Let's just assume they're valid.
		return getAllLinkedPaths(inputPath, sourceFilePath)
			.filter(linkedFilePath => !isAbsoluteUrl.test(linkedFilePath))
			.map(getLinkData)
	})

	// Return all linked files that failed to be created!
	return flatten(linksFromEachSource).filter(data => !fs.existsSync(data.link))
}

function getAllLinkedPaths(inputPath, filename) {
	var content = contentOf(path.join(inputPath, filename))

	return getLinkExtractor(filename)(content)
}

function getLinkExtractor(filename) {
	let extension = path.extname(filename).toLowerCase()

	switch (extension) {
		case ".html":
			return extractHref
		case ".md":
			return markdownLinkExtractor
	}

	throw new Error(`Unsupported extension of '${extension}' on file '${filename}' for link validation`);
}