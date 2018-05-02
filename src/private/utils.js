
export const identity = x => x;
// eslint-disable-next-line valid-typeof
export const is = type => x => typeof x === type;
export const isString = is('string');
export const isFunction = is('function');
export const isObject = is('object');
export const { isArray } = Array;
