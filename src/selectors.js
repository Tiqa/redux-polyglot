import { path } from 'ramda';
import { createSelector } from 'reselect';
import Polyglot from 'node-polyglot';

const getPhrases = path(['polyglot', 'phrases']);

export const getLocale = path(['polyglot', 'locale']);
export const getT = createSelector(
    getLocale,
    getPhrases,
    (locale, phrases) => new Polyglot({
        locale,
        phrases,
    }).t
);
