const {SheetsRegistry} =  require('react-jss');
const serverView = require('./build/server/Main').default;


//const { SheetsRegistry } = require('jss');
// const { styles } = require('./build/Button');
//
// const sheet = jss.createStyleSheet(styles);

//sheet.attached = true;
//const sheets = new SheetsRegistry();
// sheets.add(sheet);

const sheets = new SheetsRegistry();
serverView('/', sheets);

console.log(sheets.toString());