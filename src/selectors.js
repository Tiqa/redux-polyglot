import { compose } from 'redux';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';

// eslint-disable-next-line valid-typeof
const is = type => x => typeof x === type;
const isString = is('string');
const path = arrPath => obj => arrPath.reduce((cursor, key) => cursor && cursor[key], obj);
const toUpper = str => str.toUpperCase();
const adjustString = (f, index) => str => (
    str.substr(0, index) + f(str[index]) + str.substr(index + 1)
);
const capitalize = adjustString(toUpper, 0);

const getLocale = path(['polyglot', 'locale']);
const getPhrases = path(['polyglot', 'phrases']);
const getPolyglotScope = (state, options) => (
    options.polyglotScope === '' ? '' : `${options.polyglotScope}.`
);

const getPolyglot = createSelector(
    getLocale,
    getPhrases,
    getPolyglotScope,
    (locale, phrases, polyglotScope = '') => {
        const p = new Polyglot({
            locale,
            phrases,
        });
        const t = p.t.bind(p);
        p.t = (text, ...args) => t(polyglotScope + text, ...args);
        return p;
    }
);

const getTranslation = createSelector(
    getPolyglot,
    (p) => p.t.bind(p)
);

const getTranslationMorphed = (...args) => f => compose(f, getTranslation(...args));
const getTranslationUpperCased = (...args) => getTranslationMorphed(...args)(toUpper);
const getTranslationCapitalized = (...args) => getTranslationMorphed(...args)(capitalize);

const getP = (state, options = {}) => {
    if (!getLocale(state) || !getPhrases(state))
        return undefined;
    const polyglotScope = isString(options) ? options : options.polyglotScope;
    const ownProps = { polyglotScope: polyglotScope || '' };
    return {
        ...getPolyglot(state, ownProps),
        t: getTranslation(state, ownProps),
        tc: getTranslationCapitalized(state, ownProps),
        tu: getTranslationUpperCased(state, ownProps),
        tm: getTranslationMorphed(state, ownProps),
    };
};

export { getP, getLocale };
