import { path, compose, adjust, toUpper, join } from 'ramda';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';

const capitalize = compose(join(''), adjust(toUpper, 0));

const getPhrases = path(['polyglot', 'phrases']);
const getLocale = path(['polyglot', 'locale']);

const getTranslation = createSelector(
    getLocale,
    getPhrases,
    (locale, phrases) => new Polyglot({
        locale,
        phrases,
    }).t
);
const getTranslationCapitalized = compose(capitalize, getTranslation);
const getTranslationUpperCased = compose(toUpper, getTranslation);

const getP = state => ({
    t: getTranslation(state),
    tc: getTranslationCapitalized(state),
    tu: getTranslationUpperCased(state),
});

export { getP, getLocale };
