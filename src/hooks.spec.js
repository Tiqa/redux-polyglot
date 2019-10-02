import { useP } from './hooks';
import { testHook } from './private/test/testUtils';

describe('hooks', () => {
    describe('useP', () => {
        const state = {
            polyglot: {
                locale: 'en', phrases: { hello: 'hi', scope1: { hello: 'scoped-hi' } },
            },
        };
        it('returns the p object', () => {
            testHook(() => {
                const p = useP();
                expect(p.t('hello')).toEqual('hi');
            }, state);
        });

        it('accepts getP options', () => {
            testHook(() => {
                const p = useP({ polyglotScope: 'scope1' });
                expect(p.t('hello')).toEqual('scoped-hi');
            }, state);
        });
    });
});
