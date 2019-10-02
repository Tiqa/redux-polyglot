import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

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
