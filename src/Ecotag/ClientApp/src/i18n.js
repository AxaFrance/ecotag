import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translation_en from './translations/en/translation.json';
import constants_en from './translations/en/constants.json';
import toolkit_en from './translations/en/toolkit.json';
import translation_fr from './translations/fr/translation.json';
import constants_fr from './translations/fr/constants.json';
import toolkit_fr from './translations/fr/toolkit.json';

const resources = {
    en: {
        translation: translation_en,
        constants: constants_en,
        toolkit: toolkit_en
    },
    fr: {
        translation: translation_fr,
        constants: constants_fr,
        toolkit: toolkit_fr
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;