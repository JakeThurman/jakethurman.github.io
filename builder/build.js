const path = require('path')
const fs = require('fs')
const { runCompiler } = require('./staticSiteCompiler')

// Parameters (todo: should probably be command line)
const paths = {
	output: '../',
	contentSubfolder: 'site/',
	input: '../content/',
	rootFiles: ['index.md'],
}

// Shortcut for data in specific 
const isRootFile = fileName => paths.rootFiles.some(root => root.toLowerCase() === fileName.toLowerCase());
const withHtmlExtension = filePath => path.extname(filePath).toLowerCase() === ".md" ? filePath.replace(".md", ".html") : filePath

// Appropriately localizes an output path
function translateToOutputPath(from, to) {
	// Cut the path of of from.
	from = path.basename(from)

	// If only one parameter is given, assume they are the same.
	if (!to) to = from;

	// Translate md extension to md
	to = withHtmlExtension(to)

	// If we are at the root, or asked to go to the root, do so.
	if (isRootFile(from) || to[0] == "/")
		return path.join(paths.output, to)
	
	// Otherwise we should be in the content subfolder.
	return path.join(paths.output, paths.contentSubfolder, to)
}

var sourceFiles = fs.readdirSync(paths.input)
				  .map(fileName => path.join(paths.input, fileName))

runCompiler({
	translateToOutputPath,
	sourceFiles,
});