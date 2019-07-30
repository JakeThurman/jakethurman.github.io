const path = require('path')
const linkValidator = require('./linkValidator')
const {
	contentOf,
	hashOfFile,
	htmlOfMD,
	templateOf,
	htmlWriter,
	getAllOfTypeInDir,
} = require('./contentHelpers')

// Parameters (todo: should probably be command line)
const paths = {
	output: '../',
	contentSubfolder: 'site/',
	input: '../content/',
	templateFile: "template.html",
	rootFile: 'index.md',
}

// Handle browser caching of stylesheet
const stylesheetPath = '/style.css?nocache=' + hashOfFile('../style.css')

// Shortcut for data in specific 
const getInputFilesOfType = extension => getAllOfTypeInDir(paths.input, extension).filter(name => name.toLowerCase() != paths.rootFile)
const generateFromTemplate = htmlWriter(templateOf(paths.templateFile))
const withHtmlExtension = mdPath => mdPath.replace(".md", ".html")
const settingsFromBody = body => ({ body, stylesheetPath })

// Appropriately localizes an output path
function localizeLink(from, to) {
	// If only one parameter is given, assume they are the same.
	if (!to) to = from;

	// If we are at the root, or asked to go to the root, do so.
	if (from == paths.rootFile || to[0] == "/")
		return path.join(paths.output, to)
	
	// Otherwise we should be in the content subfolder.
	return path.join(paths.output, paths.contentSubfolder, to)
}

// Write the root file
generateFromTemplate(
	localizeLink(withHtmlExtension(paths.rootFile)), 
	settingsFromBody(htmlOfMD(path.join(paths.input, paths.rootFile)))
)

// Render each of the pages to an appropriate file
let allMD = getInputFilesOfType("md")
let mdOutputPromises = allMD
	.map(async (name) => {
		var settings = settingsFromBody(htmlOfMD(path.join(paths.input, name)));
		var writeTo = localizeLink(withHtmlExtension(name));
		await generateFromTemplate(writeTo, settings)
	})

let allHtml = getInputFilesOfType("html")
let htmlOutputPromises = allHtml
	.map(async (name) => {
		var settings = settingsFromBody(contentOf(path.join(paths.input, name)));
		var writeTo = localizeLink(name);
		await generateFromTemplate(writeTo, settings)
	})

// Check links of the files
Promise.all(mdOutputPromises.concat(htmlOutputPromises)).then(() => {
	// Perform link validation
	let allFiles = [paths.rootFile].concat(allMD).concat(allHtml);
	let missingLinkedFiles = linkValidator.getBadLinks(allFiles, paths.input, localizeLink);
	
	missingLinkedFiles.forEach(data => console.log(`Bad link to "${data.link}" in file ${data.source}`));
	console.log("Build " + (missingLinkedFiles.length === 0 ? "Succeeded" : "FAILED"));
})
