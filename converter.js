const createJSSInstance = require('./build/createJSSInstance').default;
const jss = createJSSInstance();
const {SheetsRegistry} = require('jss');
const path = require('path');
const fs=require('fs');

let stylefiles = [];
function fromDir(startPath,filter){

	startPath = path.resolve(startPath);

	if (!fs.existsSync(startPath)){
		return [];
	}

	let files=fs.readdirSync(startPath);
	for(let i=0;i<files.length;i++){
		let filename=path.join(startPath,files[i]);
		let stat = fs.lstatSync(filename);
		if (stat.isDirectory()){
			fromDir(filename,filter); //recurse
		}
		else if (filename.indexOf(filter)>=0) {
			stylefiles.push(filename);
		}
	}
}

fromDir('./src','.style.js');

const sheets = new SheetsRegistry();

for (let i=0; i<stylefiles.length;i++) {
	const sheet = jss.createStyleSheet(require(stylefiles[i])).attach();
	sheets.add(sheet);
}


console.log(sheets.toString());