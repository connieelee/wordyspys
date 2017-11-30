import { Reducer, Thunk } from 'redux-testkit';
import configureMockStore from 'redux-mock-store';
import thunks from 'redux-thunk';
import db from '../../firebase/db';

import spymastersReducer, {
  createSpymasters,
  listenOnSpymasters,
  claimMaster,
  disconnectMaster,
} from './';
import {
  mockStoreInitialState,
  seedTestRoom,
} from '../../utils/tests';

describe('Spymasters Reducer', () => {
  describe('sync actions', () => {
    const initialState = {
      ownTeam: '',
      taken: {
        RED: false,
        BLUE: false,
      },
    };

    it('should return initial state', () => {
      expect(spymastersReducer(undefined, {})).toEqual(initialState);
    });
    it('should handle SET_MASTER_TEAM', () => {
      const action = { type: 'SET_MASTER_TEAM', color: 'RED' };
      Reducer(spymastersReducer).expect(action).toChangeInState({ ownTeam: 'RED' });
    });
    it('should handle UNSET_MASTER_TEAM', () => {
      const action = { type: 'UNSET_MASTER_TEAM' };
      Reducer(spymastersReducer)
        .withState(Object.assign({ ownTeam: 'RED' }, initialState))
        .expect(action)
        .toReturnState(initialState);
    });
    it('should handle MARK_MASTER_TAKEN', () => {
      const markAction = { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: true };
      Reducer(spymastersReducer).expect(markAction).toChangeInState({ taken: { RED: true } });
      const unmarkAction = { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: false };
      Reducer(spymastersReducer).expect(unmarkAction).toReturnState(initialState);
    });
  });

  describe('thunks', () => {
    describe('that start with empty state/db', () => {
      beforeEach(() => seedTestRoom({ spymasters: true }));
      describe('createSpymasters', () => {
        let actions;
        beforeEach(() => (
          Thunk(createSpymasters).withState(mockStoreInitialState).execute()
          .then(dispatches => {
            actions = dispatches.map(dispatch => dispatch.getAction());
          })
        ));
        it('creates new spymasters object in db', () => (
          db.ref('rooms/test/spymasters').once('value')
          .then(snapshot => expect(snapshot.val()).toEqual({ RED: false, BLUE: false }))
        ));
        it('marks both spymasters false', () => {
          expect(actions).toEqual([
            { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: false },
            { type: 'MARK_MASTER_TAKEN', color: 'BLUE', bool: false },
          ]);
        });
      });

      describe('listenOnSpymasters', () => {
        afterEach(() => db.ref('rooms/test/spymasters').off());
        it('creates MARK_MASTER_TAKEN actions only if db changes', () => {
          const dispatches = Thunk(listenOnSpymasters).withState(mockStoreInitialState).execute();
          return db.ref('rooms/test/spymasters/RED').set(true)
          .then(() => db.ref('rooms/test/spymasters/RED').set(true))
          .then(() => {
            const actions = dispatches.map(dispatch => dispatch.getAction());
            expect(actions).toEqual([{ type: 'MARK_MASTER_TAKEN', color: 'RED', bool: true }]);
          });
        });
        it('returns a function to stop listening', () => {
          const store = configureMockStore([thunks])(mockStoreInitialState);
          const unsubscribe = store.dispatch(listenOnSpymasters());
          unsubscribe();
          return db.ref('rooms/test/spymasters/RED').set(true)
          .then(() => expect(store.getActions()).toEqual([]));
        });
      });

      describe('claimMaster', () => {
        let actions;
        beforeEach(() => (
          Thunk(claimMaster).withState(mockStoreInitialState).execute('RED')
          .then(dispatches => {
            actions = dispatches.map(dispatch => dispatch.getAction());
          })
        ));
        it('sets spymaster to be taken in db', () => (
          db.ref('rooms/test/spymasters/RED').once('value')
          .then(snapshot => expect(snapshot.val()).toEqual(true))
        ));
        it('creates SET_MASTER_TEAM to update ownTeam', () => {
          expect(actions).toEqual([{ type: 'SET_MASTER_TEAM', color: 'RED' }]);
        });
      });
    });

    describe('that start with populated state', () => {
      describe('disconnectMaster', () => {
        let actions;
        beforeEach(() => {
          const filledMockState = Object.assign({}, mockStoreInitialState);
          filledMockState.roomCode.value = 'test';
          filledMockState.spymasters.ownTeam = 'RED';
          filledMockState.spymasters.taken.RED = true;
          return db.ref('rooms/test/spymasters/RED').set(true)
          .then(() => Thunk(disconnectMaster).withState(filledMockState).execute())
          .then(dispatches => {
            actions = dispatches.map(dispatch => dispatch.getAction());
          });
        });

        it('sets own team\'s master to false in db', () => (
          db.ref('rooms/test/spymasters/RED').once('value')
          .then(snapshot => expect(snapshot.val()).toEqual(false))
        ));

        it('creates UNSET_MASTER_TEAM to remove ownTeam in state', () => {
          expect(actions).toEqual([{ type: 'UNSET_MASTER_TEAM' }]);
        });
      });
    });
  });
});
