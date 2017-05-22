const toBe = (type) => (received) => {
    // eslint-disable-next-line valid-typeof
    const isFunction = typeof received === type;
    return {
        pass: isFunction,
        message: `expected ${received}${isFunction ? 'not' : ''} to be a function`,
    };
};

expect.extend({
    toBeFunction: toBe('function'),
    toBeString: toBe('string'),
});
