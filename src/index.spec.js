import * as all from './';
import translate from './translate';

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

describe('index', () => {
    it('exports middleware', () => {
        expect(all.createPolyglotMiddleware).toBeFunction();
    });
    it('exports SET_LANGUAGE action', () => {
        expect(all.SET_LANGUAGE).toBeString();
    });
    it('exports setLanguage action creator', () => {
        expect(all.setLanguage).toBeFunction();
    });
    it('exports reducer', () => {
        expect(all.polyglotReducer).toBeFunction();
    });
    it('exports selectors', () => {
        expect(all.getP).toBeFunction();
        expect(all.getLocale).toBeFunction();
    });
    it('exports translate enhancer', () => {
        expect(translate).toBeFunction();
    });
    it('exports p PropTypes', () => {
        expect(all.PropType).toBeFunction();
    });
});
