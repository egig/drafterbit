import Module from './../../module';

class ThemeModule extends  Module {

  constructor(app) {
    super(app);
    this._theme = 'feather';
  }

  getName(){
   return 'theme';
  }

  getViewPath() {
    // @todo get this from theme manager
    return __dirname+'/../../themes/'+this._theme+'/views';
  }

  getPublicPath() {
    // @todo get this from theme manager
    return __dirname+'/../../themes/'+this._theme+'/public';
  }

}

export default ThemeModule;
