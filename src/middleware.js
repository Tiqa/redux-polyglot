import { is } from 'ramda';
import { setLanguage } from './actions';

const isString = is(String);
const isFunction = is(Function);
const isArray = Array.isArray;

const checkParams = (catchedAction, getLocale, getPhrases) => {
    if (!catchedAction || !getLocale || !getPhrases)
        throw (new Error('polyglotMiddleware : missing parameters.'));
    if (!isString(catchedAction) && !isArray(catchedAction)) {
        throw (new Error(
            'polyglotMiddleware : first parameter must be a string or an array of string.'
        ));
    }
    if (!isFunction(getLocale))
        throw (new Error('polyglotMiddleware : second parameter must be a function.'));
    if (!isFunction(getPhrases))
        throw (new Error('polyglotMiddleware : third parameter must be a function.'));
};

export const createPolyglotMiddleware = (catchedAction, getLocale, getPhrases) => {
    checkParams(catchedAction, getLocale, getPhrases);
    const actions = isArray(catchedAction) ? catchedAction : [catchedAction];
    return ({ dispatch, getState }) => next => action => {
        if (actions.includes(action.type)) {
            const locale = getLocale(action);
            const previousLocale = getState().polyglot.locale;
            if (previousLocale !== locale) {
                getPhrases(locale).then(phrases => {
                    dispatch(setLanguage(locale, phrases));
                });
            }
        }
        return next(action);
    };
};
