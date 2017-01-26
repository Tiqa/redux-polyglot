import { compose } from 'redux';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';
import { identity } from './private/utils';

const path = arrPath => obj => arrPath.reduce((cursor, key) => cursor && cursor[key], obj);
const toUpper = str => str.toUpperCase();
const adjustString = (f, index) => str => (
    str.substr(0, index) + f(str[index]) + str.substr(index + 1)
);
const capitalize = adjustString(toUpper, 0);

const getLocale = path(['polyglot', 'locale']);
const getPhrases = path(['polyglot', 'phrases']);
const getPolyglotScope = (state, { polyglotScope = '' }) => (
    polyglotScope === '' ? '' : `${polyglotScope}.`
);

const getPolyglotOptions = (state, { polyglotOptions = {} }) => polyglotOptions;

const getPolyglot = createSelector(
    getLocale,
    getPhrases,
    getPolyglotOptions,
    (locale, phrases, polyglotOptions) => new Polyglot({
        locale,
        phrases,
        ...polyglotOptions,
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

const createGetP = (polyglotOptions) => {
    const getP = createSelector(
        getLocale,
        getPhrases,
        getPolyglot,
        getTranslation,
        getTranslationCapitalized,
        getTranslationUpperCased,
        getTranslationMorphed,
        (locale, phrases, p, t, tc, tu, tm) => {
            if (!locale || !phrases) {
                return {
                    t: identity,
                    tc: identity,
                    tu: identity,
                    tm: identity,
                };
            }
            return {
                ...p,
                t,
                tc,
                tu,
                tm,
            };
        },
    );
    return (state, options) => getP(state, { ...options, polyglotOptions });
};

const getP = createGetP();

export { getP, getLocale, createGetP };
