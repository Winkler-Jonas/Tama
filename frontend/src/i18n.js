import { createI18n } from 'vue-i18n';
import { emitter } from '@/eventEmitter.js';

async function loadLocaleMessages(locale) {
    const context = import.meta.glob('./assets/locals/*.json', { eager: false });
    const filePath = `./assets/locals/${locale}.json`;

    if (!context[filePath]) {
        console.error('Locale data file not found:', filePath);
        console.log('Available files:', Object.keys(context));
        return {};
    }

    const messages = await context[filePath]();
    return messages.default;
}

export async function setupI18n(locale = 'en') {
    const messages = await loadLocaleMessages(locale);
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale,
        fallbackLocale: 'en',
        messages: { [locale]: messages }
    });

    // Reactively handle locale changes
    emitter.on('localeChanged', async (newLocale) => {
        if (!i18n.global.availableLocales.includes(newLocale)) {
            const newMessages = await loadLocaleMessages(newLocale);
            i18n.global.setLocaleMessage(newLocale, newMessages);
        }
        i18n.global.locale.value = newLocale;
    });

    return i18n;
}
