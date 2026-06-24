import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './languages/en/translation.json';
import fiTranslation from './languages/fi/translation.json';
import viTranslation from './languages/vi/translation.json';
i18n
    .use(backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            fi: {
                translation: fiTranslation
            },
            vi: {
                translation: viTranslation
            }
        },
        fallbackLng: 'en',
        debug: true,
        
        interpolation: {
            escapeValue: false
        }

    })
    

export default i18n