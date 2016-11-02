'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setLanguage = undefined;

var _constants = require('./constants');

var setLanguage = exports.setLanguage = function setLanguage(locale, phrases) {
    return {
        type: _constants.SET_LANGUAGE,
        payload: {
            locale: locale,
            phrases: phrases
        }
    };
};