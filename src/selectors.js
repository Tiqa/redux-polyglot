import { path, compose, adjust, toUpper, join } from 'ramda';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';

const capitalize = compose(join(''), adjust(toUpper, 0));

const getLocale = path(['polyglot', 'locale']);
const getPhrases = path(['polyglot', 'phrases']);

const getTranslation = createSelector(
    getLocale,
    getPhrases,
    (locale, phrases) => {
        const p = new Polyglot({
            locale,
            phrases,
        });
        return p.t.bind(p);
    }
);
const getTranslationCapitalized = state => compose(capitalize, getTranslation(state));
const getTranslationUpperCased = state => compose(toUpper, getTranslation(state));

const getP = state => {
    if (!getLocale(state) || !getPhrases(state))
        return undefined;
    return {
        t: getTranslation(state),
        tc: getTranslationCapitalized(state),
        tu: getTranslationUpperCased(state),
    };
};

export { getP, getLocale };
