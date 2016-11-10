'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPolyglotMiddleware = undefined;

var _actions = require('./actions');

var _utils = require('./private/utils');

var checkParams = function checkParams(catchedAction, getLocale, getPhrases) {
    if (!catchedAction || !getLocale || !getPhrases) throw new Error('polyglotMiddleware : missing parameters.');
    if (!(0, _utils.isString)(catchedAction) && !(0, _utils.isArray)(catchedAction)) {
        throw new Error('polyglotMiddleware : first parameter must be a string or an array of string.');
    }
    if (!(0, _utils.isFunction)(getLocale)) throw new Error('polyglotMiddleware : second parameter must be a function.');
    if (!(0, _utils.isFunction)(getPhrases)) throw new Error('polyglotMiddleware : third parameter must be a function.');
};

var getIsValidPolyglotReducer = function getIsValidPolyglotReducer(state) {
    return !!(state && (0, _utils.isObject)(state.polyglot));
};
var checkState = function checkState(state) {
    if (!getIsValidPolyglotReducer(state)) throw new Error('polyglotReducer : need to be store in "state.polyglot"');
};

var createPolyglotMiddleware = exports.createPolyglotMiddleware = function createPolyglotMiddleware(catchedAction, getLocale, getPhrases) {
    checkParams(catchedAction, getLocale, getPhrases);
    var actions = (0, _utils.isArray)(catchedAction) ? catchedAction : [catchedAction];
    return function (_ref) {
        var dispatch = _ref.dispatch;
        var getState = _ref.getState;

        checkState(getState());
        return function (next) {
            return function (action) {
                if (actions.includes(action.type)) {
                    (function () {
                        var locale = getLocale(action);
                        getPhrases(locale).then(function (phrases) {
                            dispatch((0, _actions.setLanguage)(locale, phrases));
                        });
                    })();
                }
                return next(action);
            };
        };
    };
};