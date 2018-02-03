const jss = require('./jss-config');
const {SheetsRegistry} = require('jss');


const sheets = new SheetsRegistry();

// TODO loop this
const sheet = jss.createStyleSheet(require('./src/common/modules/user/components/Login.style')).attach();
const sheet5 = jss.createStyleSheet(require('./src/common/modules/user/components/ForgotPassword.style')).attach();
const sheet4 = jss.createStyleSheet(require('./src/common/modules/user/components/Register.style')).attach();
const sheet2 = jss.createStyleSheet(require('./src/common/modules/user/components/AuthCard.style')).attach();
const sheet3 = jss.createStyleSheet(require('./src/common/modules/content/components/ContentEditor.style')).attach();
sheets.add(sheet);
sheets.add(sheet2);
sheets.add(sheet3);
sheets.add(sheet4);
sheets.add(sheet5);

console.log(sheets.toString());