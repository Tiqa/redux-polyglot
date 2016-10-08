import { toUpper } from 'ramda';
import { getP, getLocale } from './selectors';

const fakeState = {
    polyglot: {
        locale: 'fr',
        phrases: { hello: 'bonjour' },
    },
};

describe('selectors', () => {
    describe('getLocale', () => {
        it('should not crash when state is an empty object', () => {
            expect(getLocale({})).toBe(undefined);
        });

        it('should not crash when state is an empty object', () => {
            expect(getLocale(fakeState)).toBe('fr');
        });
    });

    describe('getP', () => {
        const p = getP(fakeState);

        it('should not crash when state is an empty object', () => {
            expect(getP({})).toBe(undefined);
        });

        it('should translate "hello" to "bonjour"', () => {
            expect(p.t('hello')).toBe('bonjour');
        });

        it('should translate "hello" to "Bonjour" (capitalize)', () => {
            expect(p.tc('hello')).toBe('Bonjour');
        });

        it('should translate "hello" to "BONJOUR" (upper-case)', () => {
            expect(p.tu('hello')).toBe('BONJOUR');
        });

        it('should translate "hello" to "BONJOUR" (morphed with upper-case)', () => {
            expect(p.tm(toUpper)('hello')).toBe('BONJOUR');
        });
    });
});
