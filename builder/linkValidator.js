const fs = require('fs')
const path = require('path')
const markdownLinkExtractor = require('markdown-link-extractor')
const extractHref = require('get-hrefs')
const { contentOf } = require('./contentHelpers')

// Checks if a url is an absolute path
const isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');

// Helper to flatten nested lists
const flatten = xs => xs.reduce((x,y) => x.concat(y), [])

exports.getBadLinks = async function (fileNames, localizeLink) {
	let linksFromEachSource = fileNames.map(sourceFilePath => {
		// We call localize link becuase there are relative to the file they're from.
		//  and we want to check if they are valid from their final location.
		const getLinkData = linkedPath => ({ 
			source: sourceFilePath, 
			link: localizeLink(sourceFilePath, linkedPath) 
		})

		// Note that for now we're not validating any exernal links. Let's just assume they're valid.
		const paths = getAllLinkedPaths(sourceFilePath)
		return paths
			.filter(linkedFilePath => !isAbsoluteUrl.test(linkedFilePath))
			.map(getLinkData)
	})

	// Return all linked files that failed to be created!
	var promises = flatten(linksFromEachSource).map(data => 
		new Promise(resolve => {
			fs.exists(data.link, exists => resolve({ data, exists }))
		}))

	var results = await Promise.all(promises)
	
	// Return all results where the file does not exist
	return results.filter(r => !r.exists).map(r => r.data)
}

function getAllLinkedPaths(filePath) {
	var content = contentOf(filePath)

	return getLinkExtractor(filePath)(content)
}

function getLinkExtractor(filePath) {
	let extension = path.extname(filePath).toLowerCase()

	switch (extension) {
		case ".html":
			return extractHref
		case ".md":
			return (content) => markdownLinkExtractor(content).links // we don't care about anchors
	}

	throw new Error(`Unsupported extension of '${extension}' on file '${filename}' for link validation`);
}
