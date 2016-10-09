import * as all from './';
import { translate } from './translate';

describe('index', () => {
    it('exports middleware', () => {
        expect(all.createPolyglotMiddleware).toBeDefined();
    });
    it('exports SET_LANGUAGE action', () => {
        expect(all.SET_LANGUAGE).toBeDefined();
    });
    it('exports setLanguage action creator', () => {
        expect(all.setLanguage).toBeDefined();
    });
    it('exports reducer', () => {
        expect(all.polyglotReducer).toBeDefined();
    });
    it('exports selectors', () => {
        expect(all.getP).toBeDefined();
        expect(all.getLocale).toBeDefined();
    });
    it('exports translate enhancer', () => {
        expect(translate).toBeDefined();
    });
});
