import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';
import keyCardReducer, { createKeyCard } from './';

import mockStoreInitialState from '../../utils/mockStoreInitialState';
import testKeyCard from '../../../seed/room/keyCard';

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

    describe.only('createKeyCard', () => {
      it('updates the db with newly created keyCard', () => (
        store.dispatch(createKeyCard())
        .then(action => Promise.all([db.ref('rooms/test/keyCard').once('value'), action.keyCard]))
        .then(([snapshot, keyCard]) => expect(snapshot.val()).toEqual(keyCard))
      ));
      it('creates SET_KEYCARD and SET_CURRENT_TEAM once keys have been created', () => (
        store.dispatch(createKeyCard())
        .then(() => {
          const expectedActionTypes = ['SET_KEYCARD', 'SET_CURRENT_TEAM'];
          const actualActionTypes = store.getActions().map(action => action.type);
          expect(actualActionTypes).toContain(...expectedActionTypes);
        })
      ));
    });
  });
});
