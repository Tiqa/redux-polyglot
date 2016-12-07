import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import renderer from 'react-test-renderer';

import { polyglotReducer } from 'redux-polyglot/src/reducer';
import translate from './translate';

const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
const fakeStore = createStore(createRootReducer(), {
    polyglot: { locale: 'en', phrases: { hello: 'hello' } },
});

const createAnonymousComponent = () => () => (<div />);

const DummyComponentWithDisplayName = createAnonymousComponent();
const name = 'DummyComponent';
DummyComponentWithDisplayName.displayName = name;

describe('translate enhancer', () => {
    const DummyComponent = ({ p }) => (
        <div
            data-t={p.t('hello')}
            data-tc={p.tc('hello')}
            data-tu={p.tu('hello')}
        />
    );
    const EnhancedComponent = translate(DummyComponent);

    const tree = renderer.create(
        <Provider store={fakeStore}>
            <EnhancedComponent />
        </Provider>
    ).toJSON();

    it('provides a valid p object.', () => {
        expect(tree.props['data-t']).toBe('hello');
        expect(tree.props['data-tc']).toBe('Hello');
        expect(tree.props['data-tu']).toBe('HELLO');
    });

    it('should return a valid translated component', () => {
        const Dummy = DummyComponent;
        expect(translate(Dummy).displayName).toEqual(EnhancedComponent.displayName);
        expect(translate('', Dummy).displayName).toEqual(EnhancedComponent.displayName);
        expect(translate('')(Dummy).displayName).toEqual(EnhancedComponent.displayName);
    });

    describe('displayName', () => {
        it('has a valid displayName', () => {
            const translatedName = `Translated(${name})`;
            expect(EnhancedComponent.displayName).toBe(translatedName);
            expect(translate(DummyComponentWithDisplayName).displayName)
                .toBe(translatedName);
        });

        it('has a default name when it is an anonymous component', () => {
            const translatedDefaultName = 'Translated(Component)';
            const TranslatedComponent = translate(createAnonymousComponent());
            expect(TranslatedComponent.displayName).toBe(translatedDefaultName);
        });
    });
});
