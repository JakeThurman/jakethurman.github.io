const crypto = require("crypto");
const showdown = require('showdown');
const handlebars = require('handlebars');
const fs = require('fs');

// Parameters (todo: should probably be command line)
const outputPath = '../';
const contentSubfolder = 'site/';
const inputPath = '../content/';

// Data
const buildid = crypto.randomBytes(16).toString("hex")

// File Helpers
const contentOf = filename => fs.readFileSync(filename, 'utf8');
const contentUsingBuildId = filename => contentOf(filename).replace("{{buildid}}", buildid);
const writeFile = (filename, content) => fs.writeFile(filename, content, err => {
	if(err) throw err;
	console.log(`${filename} - COMPLETE`);
}); 

// Markdown, handlebars helpers
const mdConverter = new showdown.Converter();
const htmlOfMD = mdFile => mdConverter.makeHtml(contentOf(mdFile));
const templateOf = filename => handlebars.compile(contentOf(filename))
const htmlWriter = (template) => (name, settings) => writeFile(name, template(settings)); 

// Shortcut for data in specific 
const generateFromTemplate = htmlWriter(templateOf("template.html"));
const toOutputPath = path => outputPath + path.substring(0, path.length - 2) + "html";
const settingsFromBody = body => ({ body, buildid });

// Write the root file
const rootFile = "index.md";
generateFromTemplate(toOutputPath(rootFile), settingsFromBody(htmlOfMD(inputPath + rootFile)));

// Render each of the pages to an appropriate file
fs.readdirSync(inputPath)
	.filter(name => name.toUpperCase().endsWith(".MD")) // Only take MD Files
	.filter(name => name.toLowerCase() != rootFile) // Skip index page, handled seperately
	.forEach(async (name) => {
		var settings = settingsFromBody(htmlOfMD(inputPath + name));
		var writeTo = toOutputPath(contentSubfolder + name);
		generateFromTemplate(writeTo, settings);
	});
