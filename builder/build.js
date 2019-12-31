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

const isRootFile = fileName => paths.rootFiles.some(root => root.toLowerCase() === fileName.toLowerCase());

// Appropriately localizes an output path
//  `relativeTo` is optional.
function translateToOutputPath(relativeTo, inputPath) {
	// Cut the path of of from.
	//  they're all going to be in the input directory
	relativeTo = path.basename(relativeTo)

	// If only one parameter is given, we are translating the input path 
	//  to an output path relative to itself.
	//  (When a value for relativeTo is given, we are checking links for validity)
	if (!inputPath) inputPath = relativeTo;
	
	// Output path is nearly inputPath, but we're going to mutate it
	var outputPath = inputPath;

	// Translate md extension to html
	var ext = path.extname(inputPath);
	if (ext.toLowerCase() === ".md")
		outputPath = outputPath.replace(ext, ".html")

	// If we are at the root, or the path is relative to root, do so.
	if (isRootFile(relativeTo) || inputPath[0] == "/")
		return path.join(paths.output, outputPath)
	
	// Otherwise we should be in the content subfolder.
	return path.join(paths.output, paths.contentSubfolder, outputPath)
}

var sourceFiles = fs.readdirSync(paths.input)
				  .map(fileName => path.join(paths.input, fileName))

runCompiler({
	translateToOutputPath,
	sourceFiles,
});