import { polyglotReducer } from './reducer';
import { SET_LANGUAGE } from './constants';

const unknownAction = {
    type: 'UNKNOWN_ACTION',
    payload: true,
};

const setLanguageAction = {
    type: SET_LANGUAGE,
    payload: {
        locale: 'yolo',
        phrases: true,
    },
};

 // check if an unknown action impact the state
const checkUnknownAction = state => expect(state).toEqual(polyglotReducer(state, unknownAction));

describe('reducer', () => {
    let state = {
        locale: null,
        phrases: null,
    };

    beforeEach(() => checkUnknownAction(state));

    it('should not update the state when action is unknown', () => {
        state = polyglotReducer(state, unknownAction);
    });

    it('should update the state when action is SET_LANGUAGE', () => {
        state = polyglotReducer(state, setLanguageAction);
        expect(state).toEqual(setLanguageAction.payload);
    });

    afterEach(() => checkUnknownAction(state));
});
