import i18n from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const createI18nextInstance = function createI18nextInstance(browser = false, defaultLanguage = 'en', defaultLanguages = ['en', 'id']) {

	const i18nInstance = i18n.createInstance();

	let options = {
		fallbackLng: defaultLanguage,
		debug: true, // TODO get this from app config not directly from file
		lng: defaultLanguage,
		lngs: defaultLanguages
	};

	if(browser) {
		i18nInstance.use(i18nextXHRBackend);
		i18nInstance.use(LanguageDetector);
		options.resources = window.__PRELOADED_LANGUAGE_RESOURCES__;
		options.backend = {
			loadPath: '/locales/{{lng}}/{{ns}}.json',
			crossDomain: false,
			allowMultiLoading: true
		};
	}

	i18nInstance.init(options);

	return i18nInstance;
};


export function createI18nextInstanceForBrowser() {
	return createI18nextInstance(true);
};

export default createI18nextInstance;