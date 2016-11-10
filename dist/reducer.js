'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.polyglotReducer = undefined;

var _constants = require('./constants');

var initialState = {
    locale: null,
    phrases: null
};

var polyglotReducer = exports.polyglotReducer = function polyglotReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];
    return action.type === _constants.SET_LANGUAGE ? action.payload : state;
};