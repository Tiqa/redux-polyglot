import 'babel-polyfill';

import * as all from './';
import translate from './translate';

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
