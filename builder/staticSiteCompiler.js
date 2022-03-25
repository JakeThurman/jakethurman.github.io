const linkValidator = require('./linkValidator')
const filenameValidator = require('./filenameValidator')
const {
	hashOfFile,
	getCompiledContent,
	templateOf,
	writeFile
} = require('./contentHelpers')

// Handle browser caching of stylesheet
const stylesheetPath = '/style.css?v=' + hashOfFile('../style.css')

function preValidate(options) {
	const errors = [];

	console.log("Checking for files with overlapping output paths...");
	const filenameValidationErrors = filenameValidator.getFilesWithOverlappingOutputPaths(options.sourceFiles, options.translateToOutputPath)
	filenameValidationErrors.forEach(result => 
		errors.push(`Multiple files would become '${result.outputPath}' on build. These are: ${JSON.stringify(result.inputPaths)}`))	
	
	return errors;
}

async function postValidate(options) {
	const errors = [];

	console.log("Checking for bad links...");
	const missingLinkedFiles = await linkValidator.getBadLinks(options.sourceFiles, options.translateToOutputPath);
	missingLinkedFiles.forEach(data => 
		errors.push(`Bad link to "${data.link}" in file ${data.source}`))
		
	return errors;
}

async function buildContent(options) {
	const errors = []
	const template = templateOf("template.html")

	console.log(`Compiling ${options.sourceFiles.length} source files...`);
	const promises = options.sourceFiles.map(async (inputFilePath) => {
		try {
			var outputPath = options.translateToOutputPath(inputFilePath)
			
			var body = getCompiledContent(inputFilePath)
			var content = template({ stylesheetPath, body })

			await writeFile(outputPath, content)
		} catch (e) {
			errors.push(e)
		}
	})
		
	await Promise.all(promises)
	return errors
}

async function runBuild(options) {
	const stages = [ // Each is a ((options) => (string | Error)[])
		["Pre Validate", preValidate],
		["Build Content", buildContent],
		["Post Validate", postValidate],
	]

	while (stages.length) {
		var [stageName, stage] = stages.shift()

		try {
			console.log("* Stage: " + stageName + " *");

			var errors = await stage(options)
			
			// Do not continue to the next stage if one failed
			if (errors.length)
				return errors
		}
		catch (e) {
			return [e];
		}
	}

	// No errors
	return []
}

exports.runCompiler = function (options) {
	console.log("\n-----------------------------\nStarting Build\n-----------------------------")
	runBuild(options).then((errors/* (string | Error)[] */) => {
		if (errors.length) {
			console.log("\nBuild FAILED:")

			// console.log handles showing stack trace with exceptions
			errors.forEach(msg => console.log(" -", msg))

			console.log("\n-----------------------------\nBuild FAILED")
			process.exitCode = 1
		} else {
			console.log("Build Succeeded")
		}
	})
}
