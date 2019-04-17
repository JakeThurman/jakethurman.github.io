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
const generateFromTemplate = htmlWriter(templateOf(paths.templateFile))
const withHtmlExtension = mdPath => mdPath.substring(0, mdPath.length - 2) + "html"
const settingsFromBody = body => ({ body, stylesheetPath })

// Appropriately localizes an output path
function localizeLink(src, link) {
	// If only one parameter is given, assume they are the same.
	if (!link) link = src;

	// If we are at the root, or asked to go to the root, do so.
	if (src == paths.rootFile || link[0] == "/")
		return path.join(paths.output, link)
	
	// Otherwise we should be in the content subfolder.
	return path.join(paths.output, paths.contentSubfolder, link)
}


 // Grab all MD Files
let allMD = getAllOfTypeInDir(paths.input, "md")

// Write the root file
generateFromTemplate(
	localizeLink(withHtmlExtension(paths.rootFile)), 
	settingsFromBody(htmlOfMD(path.join(paths.input, paths.rootFile)))
)

// Render each of the pages to an appropriate file
let outputPromises = allMD
	.filter(name => name.toLowerCase() != paths.rootFile) // Skip index page, handled seperately
	.map(async (name) => {
		var settings = settingsFromBody(htmlOfMD(path.join(paths.input, name)));
		var writeTo = localizeLink(withHtmlExtension(name));
		await generateFromTemplate(writeTo, settings)
	})

// Check links of the files
Promise.all(outputPromises).then(() => {
	let success = linkValidator.validateAndPrint(allMD, paths.input, localizeLink);

	console.log("Build " + (success ? "Succeeded" : "FAILED"));
})
