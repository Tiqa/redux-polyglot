import { SET_LANGUAGE } from './constants';

const initialState = {
    locale: null,
    phrases: null,
};

export const polyglotReducer = (state = initialState, action) => (
    action.type === SET_LANGUAGE ? action.payload : state
);
