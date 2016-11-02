'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash.curry');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactRedux = require('react-redux');

var _selectors = require('./selectors');

var _utils = require('./private/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDisplayName = function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
};

var mapPolyglotToProps = function mapPolyglotToProps(polyglotScope) {
    return function (state) {
        return {
            p: (0, _selectors.getP)(state, polyglotScope)
        };
    };
};

var translateEnhancer = (0, _lodash2.default)(function (polyglotScope, Component) {
    var Connected = (0, _reactRedux.connect)(mapPolyglotToProps(polyglotScope))(Component);
    Connected.displayName = 'Translated(' + getDisplayName(Connected.WrappedComponent) + ')';
    return Connected;
});

var translate = function translate(fstArg, sndArg) {
    if ((0, _utils.isFunction)(fstArg)) return translateEnhancer('', fstArg);else if ((0, _utils.isString)(fstArg) && sndArg === undefined) return translateEnhancer(fstArg);
    return translateEnhancer(fstArg, sndArg);
};

exports.default = translate;