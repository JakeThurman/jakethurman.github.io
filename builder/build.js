const crypto = require("crypto");
const showdown = require('showdown');
const handlebars = require('handlebars');
const fs = require('fs');

const buildid = crypto.randomBytes(16).toString("hex")
const mdConverter = new showdown.Converter();

// File Helpers
const contentOf = filename => fs.readFileSync(filename, 'utf8');
const contentUsingBuildId = filename => contentOf(filename).replace("{{buildid}}", buildid);
const writeFile = (filename, content) => fs.writeFile(filename, content, err => {
	if(err) throw err;
    console.log(`${filename} - COMPLETE`);
}); 

// Markdown paring helper
const htmlOfMD = mdFile => mdConverter.makeHtml(contentOf(mdFile));

// Handlebar use helpers
const templateOf = filename => handlebars.compile(contentOf(filename))
const htmlWriter = (template) => (name, settings) => writeFile(name, template(settings)); 

// Grab a writer for the main template
const generateFromTemplate = htmlWriter(templateOf("template.html"));

// Grab the pages in the content dir
const contentPages = fs.readdirSync('../content')
	.filter(str => str.toUpperCase().endsWith(".MD"));

const getOutputPath = path => path.substring(0, path.length - 2) + "html"

// Render each of the pages to an appropriate file
contentPages.forEach(name => 
	generateFromTemplate('../' + getOutputPath(name), { 
		body: htmlOfMD('../content/' + name),
		buildid
	})
);
