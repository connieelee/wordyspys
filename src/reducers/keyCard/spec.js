import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';

import keyCardReducer, { createKeyCard } from './';
import {
  mockStoreInitialState,
  testKeyCard,
} from '../../utils/tests';

const mockStore = configureMockStore([thunk]);

describe('Key Card Reducer', () => {
  it('should return initial state', () => {
    const initialState = { startingTeam: '', keys: [] };
    expect(keyCardReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle SET_KEYCARD', () => {
    const setAction = { type: 'SET_KEYCARD', keyCard: testKeyCard };
    expect(keyCardReducer([], setAction)).toEqual(testKeyCard);
  });

  describe('thunks', () => {
    let store;
    beforeEach(() => {
      store = mockStore(mockStoreInitialState);
      return db.ref('rooms/test').set({ roomCode: 'test' });
    });

    describe('createKeyCard', () => {
      it('updates the db with newly created keyCard', () => (
        store.dispatch(createKeyCard())
        .then(() => db.ref('rooms/test/keyCard').once('value'))
        .then(snapshot => {
          const { startingTeam, keys } = snapshot.val();
          expect(startingTeam).toMatch(/^RED|BLUE$/);
          expect(keys).toEqual(expect.any(Array));
        })
      ));
      it('creates SET_CURRENT_TEAM once starting team is determined', () => (
        store.dispatch(createKeyCard())
        .then(() => {
          const expectedActionTypes = ['SET_CURRENT_TEAM'];
          const actualActionTypes = store.getActions().map(action => action.type);
          expect(actualActionTypes).toContain(...expectedActionTypes);
        })
      ));
    });
  });
});
