import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import renderer from 'react-test-renderer';

import { polyglotReducer } from './reducer';
import { translate } from './translate';

const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
const fakeStore = createStore(createRootReducer(), {
    polyglot: { locale: 'en', phrases: { hello: 'hello' } },
});

const DummyComponent = ({ p }) => (
    <div
        data-t={p.t('hello')}
        data-tc={p.tc('hello')}
        data-tu={p.tu('hello')}
    />
);

describe('translate enhancer', () => {
    it('should provide a valid p object.', () => {
        const EnhancedComponent = translate(DummyComponent);
        const tree = renderer.create(
            <Provider store={fakeStore}>
                <EnhancedComponent />
            </Provider>
        ).toJSON();
        expect(tree.props['data-t']).toBe('hello');
        expect(tree.props['data-tc']).toBe('Hello');
        expect(tree.props['data-tu']).toBe('HELLO');
    });
});
