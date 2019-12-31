const path = require('path')
const linkValidator = require('./linkValidator')
const filenameValidator = require('./filenameValidator')
const {
	hashOfFile,
	getCompiledContent,
	templateOf,
	htmlWriter,
} = require('./contentHelpers')

// Handle browser caching of stylesheet
const stylesheetPath = '/style.css?v=' + hashOfFile('../style.css')

const generateFromTemplate = htmlWriter(templateOf("template.html"))
const settingsFromBody = body => ({ body, stylesheetPath })

function preValidate(options) {
    let errors = [];

	let filenameValidationErrors = filenameValidator.getFilesWithOverlappingOutputPaths(options.sourceFiles, options.translateToOutputPath)

	filenameValidationErrors.forEach(result => 
		errors.push(`Multiple files would become '${result.outputPath}' on build. These are: ${JSON.stringify(result.inputPaths)}`))	
    
    return errors;
}

function postValidate(options) {
    let errors = [];

	let missingLinkedFiles = linkValidator.getBadLinks(options.sourceFiles, options.translateToOutputPath);

	missingLinkedFiles.forEach(data => 
        errors.push(`Bad link to "${data.link}" in file ${data.source}`))
        
    return errors;
}

function buildContent(options) {
	const promises = options.sourceFiles.map(async (inputFilePath) => {
        var content = getCompiledContent(inputFilePath)
        var outputPath = options.translateToOutputPath(inputFilePath);
        
        await generateFromTemplate(outputPath, settingsFromBody(content))
    })
        
    return Promise.all(promises);
}

async function runBuild(options) {
	var preValidateErrors = preValidate(options);
	
	if (preValidateErrors.length)
		return preValidateErrors

	await buildContent(options)
	
    var postValidateErrors = postValidate(options);
    return postValidateErrors;
}

exports.runCompiler = function (options) {
	console.log("\n-----------------------------\nStarting Build\n-----------------------------")
	runBuild(options).then(errors => {
		if (errors.length) {
			console.log("\nBuild FAILED:")
			errors.forEach(msg => console.log(" -", msg))

			console.log("\n-----------------------------\nBuild FAILED")
		} else {
			console.log("Build Succeeded")
		}
	})
}