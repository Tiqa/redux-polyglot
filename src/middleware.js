import { setLanguage } from './actions';
import { isString, isFunction, isObject, isArray } from './private/utils';

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

export const createPolyglotMiddleware = (catchedAction, getLocale, getPhrases) => {
    checkParams(catchedAction, getLocale, getPhrases);
    const actions = isArray(catchedAction) ? catchedAction : [catchedAction];
    return ({ dispatch, getState }) => {
        checkState(getState());
        return next => action => {
            if (actions.includes(action.type)) {
                const locale = getLocale(action);
                const nexted = next(action);
                return getPhrases(locale).then(phrases => {
                    dispatch(setLanguage(locale, phrases));
                    return nexted;
                });
            }
            return next(action);
        };
    };
};
