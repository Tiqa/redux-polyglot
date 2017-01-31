/* eslint-disable react/no-multi-comp, max-len */

import React, { PureComponent } from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import renderer from 'react-test-renderer';

import { polyglotReducer } from './reducer';
import translate from './translate';

const dummyReducer = (state = '', action) => (action.type === 'DUMMY' ? action.payload : state);
const createRootReducer = () => combineReducers({ polyglot: polyglotReducer, dummy: dummyReducer });
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

    it('should not re-render component on every non-related dispatch call', async () => {
        let pChanged = false;
        let dispatched = true;

        class TestComponent extends PureComponent {
            componentWillReceiveProps(nextProps) {
                if (nextProps.p !== this.props.p) pChanged = true;
            }

            render() {
                return <div data-t={this.props.p.t('hello')} />;
            }
        }


        class UnrelatedComponent extends PureComponent {
            componentDidMount() {
                dispatched = true;
                this.props.dispatch({ type: 'DUMMY', payload: 're-render on every dispatch' });
            }

            render() {
                return <div>{ this.props.dummy }</div>;
            }
        }

        const EnhancedTestComponent = translate(TestComponent);
        const ConnectedUnrelatedComponent = connect((state) => ({ dummy: state.dummy }))(UnrelatedComponent);

        renderer.create(
            <Provider store={fakeStore}>
                <div>
                    <EnhancedTestComponent />
                    <ConnectedUnrelatedComponent />
                </div>
            </Provider>
        ).toJSON();

        expect(dispatched).toBe(true);
        expect(pChanged).toBe(false);
    });
});
