exports.getFilesWithOverlappingOutputPaths = function(inputFiles, translateToOutputPath) {
	var results = inputFiles.reduce(function (result, nextInputPath) {
        var outputPath = translateToOutputPath(nextInputPath).toLowerCase()

		if (result[outputPath])
			result[outputPath].push(nextInputPath)
		else
            result[outputPath] = [nextInputPath]

        return result;
	}, {})

    // Get all sets of files with the same output path
	return Object.keys(results)
		.map(outputPath => ({ outputPath, inputPaths: results[outputPath] }))
		.filter(data => data.inputPaths.length > 1)
}