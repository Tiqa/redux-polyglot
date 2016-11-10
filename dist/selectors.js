'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLocale = exports.getP = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _reselect = require('reselect');

var _nodePolyglot = require('node-polyglot');

var _nodePolyglot2 = _interopRequireDefault(_nodePolyglot);

var _utils = require('./private/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = function path(arrPath) {
    return function (obj) {
        return arrPath.reduce(function (cursor, key) {
            return cursor && cursor[key];
        }, obj);
    };
};
var toUpper = function toUpper(str) {
    return str.toUpperCase();
};
var adjustString = function adjustString(f, index) {
    return function (str) {
        return str.substr(0, index) + f(str[index]) + str.substr(index + 1);
    };
};
var capitalize = adjustString(toUpper, 0);

var getLocale = path(['polyglot', 'locale']);
var getPhrases = path(['polyglot', 'phrases']);
var getPolyglotScope = function getPolyglotScope(state) {
    var polyglotScope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return polyglotScope === '' ? '' : polyglotScope + '.';
};

var getPolyglot = (0, _reselect.createSelector)(getLocale, getPhrases, function (locale, phrases) {
    return new _nodePolyglot2.default({
        locale: locale,
        phrases: phrases
    });
});

var getTranslation = (0, _reselect.createSelector)(getPolyglot, getPolyglotScope, function (p, scope) {
    return function (text) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return p.t.apply(p, [scope + text].concat(args));
    };
});

var getTranslationMorphed = function getTranslationMorphed() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return function (f) {
        return (0, _redux.compose)(f, getTranslation.apply(undefined, args));
    };
};
var getTranslationUpperCased = function getTranslationUpperCased() {
    return getTranslationMorphed.apply(undefined, arguments)(toUpper);
};
var getTranslationCapitalized = function getTranslationCapitalized() {
    return getTranslationMorphed.apply(undefined, arguments)(capitalize);
};

var getP = function getP(state, polyglotScope) {
    if (!getLocale(state) || !getPhrases(state)) {
        return {
            t: _utils.identity,
            tc: _utils.identity,
            tu: _utils.identity,
            tm: _utils.identity
        };
    }
    return _extends({}, getPolyglot(state, polyglotScope), {
        t: getTranslation(state, polyglotScope),
        tc: getTranslationCapitalized(state, polyglotScope),
        tu: getTranslationUpperCased(state, polyglotScope),
        tm: getTranslationMorphed(state, polyglotScope)
    });
};

exports.getP = getP;
exports.getLocale = getLocale;