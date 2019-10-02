import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import { polyglotReducer } from '../../reducer';

const TestHook = ({ callback }) => {
    callback();
    return null;
};

const createFakeStore = (state) => {
    const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
    return createStore(createRootReducer(), state);
};

export const testHook = (callback, state) => {
    if (state) {
        const store = createFakeStore(state);
        mount(<Provider store={store}><TestHook callback={callback} /></Provider>);
    } else
        mount(<TestHook callback={callback} />);
};
