/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
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
