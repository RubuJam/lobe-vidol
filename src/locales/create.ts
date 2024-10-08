import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

import {
  COOKIE_CACHE_DAYS,
  DEFAULT_LANG,
  LOBE_LOCALE_COOKIE,
  getDebugConfig,
} from '@/constants/i18n';
import { normalizeLocale } from '@/locales/resources';
import { isDev, isOnServerSide } from '@/utils/env';

const { I18N_DEBUG, I18N_DEBUG_BROWSER, I18N_DEBUG_SERVER } = getDebugConfig();
const debugMode = (I18N_DEBUG ?? isOnServerSide) ? I18N_DEBUG_SERVER : I18N_DEBUG_BROWSER;

export const createI18nNext = (lang?: string) => {
  const instance = i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(async (lng: string, ns: string) => {
        if (isDev && lng === 'zh-CN') return import(`./default/${ns}`);

        return import(`@/../locales/${normalizeLocale(lng)}/${ns}.json`);
      }),
    );
  return {
    init: () =>
      instance.init({
        debug: debugMode,
        ns: ['error', 'common', 'chat', 'welcome', 'role'],
        detection: {
          caches: ['cookie'],
          cookieMinutes: 60 * 24 * COOKIE_CACHE_DAYS,
          cookieOptions: {
            sameSite: 'lax',
          },
          lookupCookie: LOBE_LOCALE_COOKIE,
        },
        fallbackLng: DEFAULT_LANG,
        interpolation: {
          escapeValue: false,
        },
        lng: lang,
      }),
    instance,
  };
};
