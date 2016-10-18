import { compose } from 'redux';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';

const path = arrPath => obj => arrPath.reduce((cursor, key) => cursor && cursor[key], obj);
const toUpper = str => str.toUpperCase();
const adjustString = (f, index) => str => (
    str.substr(0, index) + f(str[index]) + str.substr(index + 1)
);
const capitalize = adjustString(toUpper, 0);

const getLocale = path(['polyglot', 'locale']);
const getPhrases = path(['polyglot', 'phrases']);
const getPolyglotScope = (state, polyglotScope = '') => (
    polyglotScope === '' ? '' : `${polyglotScope}.`
);

const getPolyglot = createSelector(
    getLocale,
    getPhrases,
    (locale, phrases) => new Polyglot({
        locale,
        phrases,
    })
);

const getTranslation = createSelector(
    getPolyglot,
    getPolyglotScope,
    (p, scope) => (text, ...args) => p.t(scope + text, ...args)
);

const getTranslationMorphed = (...args) => f => compose(f, getTranslation(...args));
const getTranslationUpperCased = (...args) => getTranslationMorphed(...args)(toUpper);
const getTranslationCapitalized = (...args) => getTranslationMorphed(...args)(capitalize);

const identity = (key) => (key);

const getP = (state, polyglotScope) => {
    if (!getLocale(state) || !getPhrases(state)) {
        return {
            t: identity,
            tc: identity,
            tu: identity,
            tm: identity,
        };
    }
    return {
        ...getPolyglot(state, polyglotScope),
        t: getTranslation(state, polyglotScope),
        tc: getTranslationCapitalized(state, polyglotScope),
        tu: getTranslationUpperCased(state, polyglotScope),
        tm: getTranslationMorphed(state, polyglotScope),
    };
};

export { getP, getLocale };
