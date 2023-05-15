import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import toolkit_en from './Toolkit/translations/en/toolkit.json';
import toolkit_fr from './Toolkit/translations/fr/toolkit.json';
import constants_dataset_en from './Server/Dataset/translations/en/constants.json';
import constants_dataset_fr from './Server/Dataset/translations/fr/constants.json'
import translations_dataset_en from './Server/Dataset/translations/en/translation.json';
import translations_dataset_fr from './Server/Dataset/translations/fr/translation.json';
import constants_group_en from './Server/Group/translations/en/constants.json';
import constants_group_fr from './Server/Group/translations/fr/constants.json';
import translations_group_en from './Server/Group/translations/en/translation.json';
import translations_group_fr from './Server/Group/translations/fr/translation.json';
import constants_project_en from './Server/Project/translations/en/constants.json';
import constants_project_fr from './Server/Project/translations/fr/constants.json';
import translations_project_en from './Server/Project/translations/en/translation.json';
import translations_project_fr from './Server/Project/translations/fr/translation.json';
import translations_home_en from './Server/Home/translations/en/translation.json';
import translations_home_fr from './Server/Home/translations/fr/translation.json';
import translations_not_found_en from './Server/NotFound/translations/en/translation.json';
import translations_not_found_fr from './Server/NotFound/translations/fr/translation.json';
import translations_shared_en from './Server/shared/translations/en/translation.json';
import translations_shared_fr from './Server/shared/translations/fr/translation.json';

const resources = {
    en: {
        translation: {
            ...translations_dataset_en,
            ...translations_group_en,
            ...translations_project_en,
            ...translations_home_en,
            ...translations_not_found_en,
            ...translations_shared_en
        },
        constants: {
            ...constants_dataset_en,
            ...constants_group_en,
            ...constants_project_en
        },
        toolkit: toolkit_en
    },
    fr: {
        translation: {
            ...translations_dataset_fr,
            ...translations_group_fr,
            ...translations_project_fr,
            ...translations_home_fr,
            ...translations_not_found_fr,
            ...translations_shared_fr
        },
        constants: {
            ...constants_dataset_fr,
            ...constants_group_fr,
            ...constants_project_fr
        },
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
