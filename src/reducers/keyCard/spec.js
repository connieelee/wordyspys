import { Reducer, Thunk } from 'redux-testkit';
import db from '../../firebase/db';

import keyCardReducer, { createKeyCard, readKeyCard } from './';
import {
  mockStoreInitialState,
  seedTestRoom,
  testKeyCard,
} from '../../utils/tests';

describe('Key Card Reducer', () => {
  describe('sync actions', () => {
    it('should return initial state', () => {
      const initialState = { startingTeam: '', keys: [] };
      expect(keyCardReducer(undefined, {})).toEqual(initialState);
    });
    it('should handle SET_KEY_CARD', () => {
      const action = { type: 'SET_KEY_CARD', keyCard: testKeyCard };
      Reducer(keyCardReducer).expect(action).toReturnState(testKeyCard);
    });
  });

  describe('thunks', () => {
    describe('createKeyCard', () => {
      let dispatches;
      beforeAll(() => (
        seedTestRoom()
        .then(() => Thunk(createKeyCard).withState(mockStoreInitialState).execute())
        .then(_dispatches => { dispatches = _dispatches; })
      ));
      it('updates the db with newly created keyCard', () => (
        db.ref('rooms/test/keyCard').once('value')
        .then(snapshot => {
          const { startingTeam, keys } = snapshot.val();
          expect(startingTeam).toMatch(/^RED|BLUE$/);
          expect(keys).toEqual(expect.any(Array));
        })
      ));
      it('dispatches `createTurn` thunk', () => {
        const expectedThunks = ['createTurnThunk'];
        const dispatchedThunks = dispatches
          .filter(dispatch => dispatch.isFunction())
          .map(dispatch => dispatch.getName());
        expect(dispatchedThunks).toEqual(expectedThunks);
      });
    });

    describe('readKeyCard', () => {
      it('dispatches SET_KEY_CARD with key card from db', () => (
        seedTestRoom({ keyCard: true })
        .then(() => Thunk(readKeyCard).withState(mockStoreInitialState).execute())
        .then(dispatches => {
          const dispatchedActions = dispatches
            .filter(dispatch => dispatch.isPlainObject())
            .map(dispatch => dispatch.getAction());
          expect(dispatchedActions).toEqual([{ type: 'SET_KEY_CARD', keyCard: testKeyCard }]);
        })
      ));
      it('dispatches `createKeyCard` thunk if no key card exists yet', () => (
        seedTestRoom({ keyCard: false })
        .then(() => Thunk(readKeyCard).withState(mockStoreInitialState).execute())
        .then(dispatches => {
          const dispatchedThunks = dispatches
            .filter(dispatch => dispatch.isFunction())
            .map(dispatch => dispatch.getName());
          expect(dispatchedThunks).toEqual(['createKeyCardThunk']);
        })
      ));
    });
  });
});
