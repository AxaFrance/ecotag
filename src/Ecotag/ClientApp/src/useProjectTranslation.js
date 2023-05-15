import './i18n';
import {useTranslation} from "react-i18next";
import i18next from 'i18next';

const useProjectTranslation = (namespace = 'translation') => {
    const {t: translate} = useTranslation(namespace);
    return {translate};
};

export const changeProjectTranslationLanguage = (language) => {
    i18next.changeLanguage(language);
};

export default useProjectTranslation;
