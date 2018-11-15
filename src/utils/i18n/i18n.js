/*
 Copyright notice:

 Xevo Application Library
 Copyright © 2017 Xevo Inc.
 Patents Pending
 All rights reserved.
 This file contains confidential and proprietary information of Xevo Inc.
 Unauthorized reproduction or distribution of this document is strictly prohibited.
 Xevo Inc.
 Website: www.xevo.com
 Email: info@xevo.com
*/

'use strict';

// var logger = require('exm-logger');
// var config = require('exm-config');

// var de = require('./translations/de');
var en = require('./locales/en.json');
// var es = require('./translations/es');
// var fr = require('./translations/fr');
// var it = require('./translations/it');
// var ja = require('./translations/ja');
// var nl = require('./translations/nl');
// var zh_Hans = require('./translations/zh_Hans');

var default_locale = 'en';
var current_locale = default_locale;

var i18n = {};
i18n.locales = {};

i18n.hasLocale = function (l) {
    return !!(i18n.locales[l.toLowerCase()]);
};

i18n.translate = function (key, opts) {
    opts = opts || {};
    var text = "";
    var locale = (typeof(opts.locale) === 'string') ? opts.locale.toLowerCase() : current_locale;
    // if (typeof(key) === 'string') key = key.toLowerCase();

    if (i18n.locales[locale] && i18n.locales[locale][key]) text = i18n.locales[locale][key];
    if (text === "" && i18n.locales[default_locale] && i18n.locales[default_locale][key]) {
        // logger.warn("I18N >> WARNING: No translation found for key '" + key + "' and locale '" + locale + "' (defaulting to '" + default_locale + "')");
        text = i18n.locales[default_locale][key];
    }
    if (text === "") {
        // logger.warn("I18N >> WARNING: No translation found for key '" + key + "' in current ('" + locale + "') or default ('" + default_locale + "') locales");
        var words = key.split('_');
        for (var i in words) {
            var word = words[i];
            words[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }
        text = words.join(' ');
    }
    for (var optkey in opts) {
      text = text.replace(new RegExp('{{'+optkey+'}}', 'g'), opts[optkey]);
    }
    text = text.replace(/{{\w+}}/g, '');
    return text;
};
i18n.t = i18n.translate;

i18n.register = function (translations, opts) {
    opts = opts || {};
    var locale = (typeof(opts.locale) === 'string') ? opts.locale.toLowerCase() : current_locale;
    i18n.locales[locale] = i18n.locales[locale] || {};

    for (var key in translations) {
        i18n.locales[locale][key] = translations[key];
    }
};

Object.defineProperty(i18n, 'locale', {
    get: function () {
        return current_locale;
    },
    set: function (l) {
        if (typeof(l) !== 'string') return;
        l = l.toLowerCase();
        if (current_locale != l && i18n.hasLocale(l)) {
            // logger.info("I18N >> Setting locale to '" + l + "'");
            current_locale = l;
            return;
        } else {
            if (!i18n.hasLocale(l)) {} // logger.warn("I18N >> Tried to set locale to '" + l + "' which is not defined");
            return;
        }
    },
    enumerable: true
});

// i18n.register(de, {locale:'de'});
i18n.register(en, {locale:'en'});
// i18n.register(es, {locale:'es'});
// i18n.register(fr, {locale:'fr'});
// i18n.register(it, {locale:'it'});
// i18n.register(ja, {locale:'ja'});
// i18n.register(nl, {locale:'nl'});
// i18n.register(zh_Hans, {locale:'zh-Hans'});

module.exports = i18n;
