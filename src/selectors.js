import { path, compose, adjust, toUpper, join } from 'ramda';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';

const capitalize = compose(join(''), adjust(toUpper, 0));

const getLocale = path(['polyglot', 'locale']);
const getPhrases = path(['polyglot', 'phrases']);

const getPolyglot = createSelector(
    getLocale,
    getPhrases,
    (locale, phrases) => {
        const p = new Polyglot({
            locale,
            phrases,
        });
        return p;
    }
);

const getTranslation = createSelector(
    getPolyglot,
    p => p.t.bind(p)
);

const getTranslationMorphed = state => f => compose(f, getTranslation(state));
const getTranslationUpperCased = state => getTranslationMorphed(state)(toUpper);
const getTranslationCapitalized = state => getTranslationMorphed(state)(capitalize);

const getP = state => {
    if (!getLocale(state) || !getPhrases(state))
        return undefined;
    return {
        ...getPolyglot(state),
        t: getTranslation(state),
        tc: getTranslationCapitalized(state),
        tu: getTranslationUpperCased(state),
        tm: getTranslationMorphed(state),
    };
};

export { getP, getLocale };
