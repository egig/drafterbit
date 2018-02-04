import i18n from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import i18nextSyncFsBackend from 'i18next-sync-fs-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const createI18nextInstance = function createI18nextInstance(browser = false) {

	let options = {
		fallbackLng: 'en',
		debug: true, // TODO get this from app config not directly from file

		// react i18next special options (optional)
		react: {
			wait: false,
			bindI18n: 'languageChanged loaded',
			bindStore: 'added removed',
			nsMode: 'default'
		}
	};

	if(browser) {
		i18n.use(i18nextXHRBackend);
		i18n.use(LanguageDetector);
		options.backend = {
			loadPath: '/locales/{{lng}}/{{ns}}.json',
			crossDomain: false
		};
	} else {
		i18n.use(i18nextSyncFsBackend);
		options.lng = 'id'; // TODO get this from request
		options.backend = {
			loadPath: __dirname + '/../locales/{{lng}}/{{ns}}.json',
			addPath: __dirname + '/../locales/{{lng}}/{{ns}}.missing.json',
			jsonIndent: 2
		};

		options.ns = [ 'login' ];
		options.initImmediate = false; // This is necessary for this sync version
	}

	i18n.init(options);

	return i18n;
};


export function createI18nextInstanceForBrowser() {
	return createI18nextInstance(true);
};

export default createI18nextInstance;