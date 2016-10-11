import { SET_LANGUAGE, SET_LOCALE } from './actions';
import { isString, isFunction, isObject, isArray } from './private/utils';

/* --- Error preventing ----------------------------------------------------- */
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

const getIsValidPolyglotReducer = state => !!(state && isObject(state.polyglot));
const checkState = state => {
    if (!getIsValidPolyglotReducer(state))
        throw (new Error('polyglotReducer : need to be store in "state.polyglot"'));
};
/* -------------------------------------------------------------------------- */

const setLanguage = (locale, phrases) => ({
    type: SET_LANGUAGE,
    payload: {
        locale,
        phrases,
    },
});

const asynscSetLanguage = (getPhrases, locale, dispatch) => {
    getPhrases(locale).then(phrases => {
        dispatch(setLanguage(locale, phrases));
    });
};

export const createPolyglotMiddleware = (catchedAction, getLocale, getPhrases) => {
    checkParams(catchedAction, getLocale, getPhrases);
    const catchedActions = isArray(catchedAction) ? catchedAction : [catchedAction];
    return ({ dispatch, getState }) => {
        checkState(getState());
        return next => action => {
            if (catchedActions.includes(action.type))
                asynscSetLanguage(getPhrases, getLocale(action), dispatch);
            else if (action.type === SET_LOCALE)
                asynscSetLanguage(getPhrases, action.payload, dispatch);
            return next(action);
        };
    };
};
