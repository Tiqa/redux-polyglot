import assign from 'lodash.assign';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';
import { identity } from './private/utils';

const path = (arrPath) => (obj) => arrPath.reduce((cursor, key) => cursor && cursor[key], obj);
const toUpper = (str) => str.toUpperCase();
const titleize = (str) => str.toLowerCase().replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase());
const adjustString = (f, index) => (str) =>
    str.substr(0, index) + f(str[index]) + str.substr(index + 1);
const capitalize = adjustString(toUpper, 0);

const getLocale = path(['polyglot', 'locale']);
const getPhrases = path(['polyglot', 'phrases']);

const getPolyglotScope = (state, { polyglotScope = '' }) =>
    (polyglotScope !== '' ? `${polyglotScope}.` : '');

const getPolyglotOwnPhrases = (state, { ownPhrases = '' }) => (ownPhrases !== '' ? ownPhrases : '');

const getPolyglotOptions = (state, { polyglotOptions }) => polyglotOptions;

const createGetPolyglot = () =>
    createSelector(
        getLocale,
        getPhrases,
        getPolyglotOptions,
        (locale, phrases, polyglotOptions) =>
            new Polyglot({
                locale,
                phrases,
                ...polyglotOptions,
            })
    );

const createGetTranslation = () =>
    createSelector(
        createGetPolyglot(),
        getPolyglotScope,
        getPolyglotOwnPhrases,
        (p, polyglotScope, ownPhrases) => (polyglotKey, ...args) => {
            const fullPath = polyglotScope + polyglotKey;
            const ownPhrase = ownPhrases !== '' ? ownPhrases[fullPath] : null;

            return ownPhrase || p.t(fullPath, ...args);
        }
    );

const createGetScopedHas = () =>
    createSelector(createGetPolyglot(), getPolyglotScope, (p, polyglotScope) => (polyglotKey) =>
        p.has(polyglotScope + polyglotKey)
    );

const createGetTranslationMorphed = () =>
    createSelector(createGetTranslation(), (t) => (f) =>
        compose(
            f,
            t
        )
    );

const createGetTranslationUpperCased = () =>
    createSelector(createGetTranslationMorphed(), (m) => m(toUpper));

const createGetTranslationCapitalized = () =>
    createSelector(createGetTranslationMorphed(), (m) => m(capitalize));

const createGetTranslationTitleized = () =>
    createSelector(createGetTranslationMorphed(), (m) => m(titleize));

const createGetP = (polyglotOptions) => {
    const options = { polyglotOptions };
    const getP = createSelector(
        getLocale,
        getPhrases,
        createGetPolyglot(),
        createGetTranslation(),
        createGetTranslationCapitalized(),
        createGetTranslationTitleized(),
        createGetTranslationUpperCased(),
        createGetTranslationMorphed(),
        createGetScopedHas(),
        (locale, phrases, p, t, tc, tt, tu, tm, has) => {
            if (!locale || !phrases) {
                return {
                    t: identity,
                    tc: identity,
                    tt: identity,
                    tu: identity,
                    tm: identity,
                    has: () => false,
                    locale: () => p.locale(),
                };
            }
            return { ...p, t, tc, tt, tu, tm, has, locale: () => locale, extend: p.extend };
        }
    );

    const getScopedP = (state, props = {}) => {
        const p = getP(state, { ...props, ...options });
        const getDeeperScope = (deeperScope) =>
            getScopedP(state, {
                ...props,
                ...options,
                polyglotScope: props.polyglotScope
                    ? `${props.polyglotScope}.${deeperScope}`
                    : deeperScope,
            });
        p.getDeeperScope = getDeeperScope;
        return p;
    };

    return getScopedP;
};

const getP = createGetP();

export { getP, getLocale, createGetP };
