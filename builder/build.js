const path = require('path')
const linkValidator = require('./linkValidator')
const filenameValidator = require('./filenameValidator')
const {
	contentOf,
	hashOfFile,
	htmlOfMD,
	templateOf,
	htmlWriter,
	getAllOfTypeInDir,
} = require('./contentHelpers')

// Queue for validation messages. 
// These will be displayed when the build fails.
var errorMessageQueue = [];

// Parameters (todo: should probably be command line)
const paths = {
	output: '../',
	contentSubfolder: 'site/',
	input: '../content/',
	templateFile: "template.html",
	rootFiles: ['index.md'],
}

// Handle browser caching of stylesheet
const stylesheetPath = '/style.css?v=' + hashOfFile('../style.css')

// Shortcut for data in specific 
const isRootFile = fileName => paths.rootFiles.some(root => root.toLowerCase() === fileName.toLowerCase());
const getInputFilesOfType = extension => getAllOfTypeInDir(paths.input, extension).filter(name => !isRootFile(name))
const generateFromTemplate = htmlWriter(templateOf(paths.templateFile))
const withHtmlExtension = filePath => path.extname(filePath).toLowerCase() === ".md" ? filePath.replace(".md", ".html") : filePath
const settingsFromBody = body => ({ body, stylesheetPath })
const hasBuildFailed = () => errorMessageQueue.length > 0;

// Appropriately localizes an output path
function translateToOutputPath(from, to) {
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

function preValidate(allFiles) {
	var filenameValidationErrors = filenameValidator.getFilesWithOverlappingOutputPaths(allFiles, translateToOutputPath)

	filenameValidationErrors.forEach(result => 
		errorMessageQueue.push(`Multiple files would become '${result.outputPath}' on build. These are: ${JSON.stringify(result.inputPaths)}`))	
}

function postValidate(allFiles) {
	let missingLinkedFiles = linkValidator.getBadLinks(allFiles, paths.input, translateToOutputPath);

	missingLinkedFiles.forEach(data => 
		errorMessageQueue.push(`Bad link to "${data.link}" in file ${data.source}`))
}

function buildContent(allMD, allHtml, allRoot) {
	// Write the root file
	let rootFileOutputPromises = allRoot
		.map(async (name) => {
			// TODO: support html root files
			var settings = settingsFromBody(htmlOfMD(path.join(paths.input, name)));
			var writeTo = translateToOutputPath(name);
			await generateFromTemplate(writeTo, settings)
		})

	let mdOutputPromises = allMD
		.map(async (name) => {
			var settings = settingsFromBody(htmlOfMD(path.join(paths.input, name)));
			var writeTo = translateToOutputPath(name);
			await generateFromTemplate(writeTo, settings)
		})

	let htmlOutputPromises = allHtml
		.map(async (name) => {
			var settings = settingsFromBody(contentOf(path.join(paths.input, name)));
			var writeTo = translateToOutputPath(name);
			await generateFromTemplate(writeTo, settings)
		})

	return Promise.all(rootFileOutputPromises.concat(mdOutputPromises).concat(htmlOutputPromises))
}

async function runBuild() {
	let allMD = getInputFilesOfType("md")
	let allHtml = getInputFilesOfType("html")
	let allRoot = paths.rootFiles;
	let allFiles = allRoot.concat(allMD).concat(allHtml);

	preValidate(allFiles);
	
	if (hasBuildFailed())
		return 

	await buildContent(allMD, allHtml, allRoot)
	
	if (hasBuildFailed())
		return 

	postValidate(allFiles);
}

console.log("\n-----------------------------\nStarting Build\n-----------------------------")
runBuild().then(() => {
	if (hasBuildFailed()) {
		console.log("\nBuild FAILED:")
		errorMessageQueue.forEach(msg => console.log(" -", msg))

		console.log("\n-----------------------------\nBuild FAILED")
	} else {
		console.log("Build Succeeded")
	}
})
