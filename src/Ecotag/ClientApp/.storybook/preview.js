import i18n from '../src/i18n';
import {Suspense, useEffect} from "react";
import {I18nextProvider} from "react-i18next";

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

export const globalTypes = {
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        toolbar: {
            icon: 'globe',
            items: [
                {value: 'en', title: 'English'},
                {value: 'fr', title: 'French'}
            ],
            showName: true
        }
    }
};

const withI18next = (Story, context) => {
    const {locale} = context.globals;

    useEffect(() => {
        i18n.changeLanguage(locale);
    }, [locale]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <I18nextProvider i18n={i18n}>
                <Story/>
            </I18nextProvider>
        </Suspense>
    );
};

export const decorators = [withI18next];
