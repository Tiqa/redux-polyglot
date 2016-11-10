'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var identity = exports.identity = function identity(x) {
  return x;
};
// eslint-disable-next-line valid-typeof
var is = exports.is = function is(type) {
  return function (x) {
    return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === type;
  };
};
var isString = exports.isString = is('string');
var isFunction = exports.isFunction = is('function');
var isObject = exports.isObject = is('object');
var isArray = exports.isArray = Array.isArray;