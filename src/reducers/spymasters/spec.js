import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';
import mockStoreInitialState from '../../utils/mockStoreInitialState';
import spymastersReducer, {
  createSpymasters,
  listenOnSpymasters,
  claimMaster,
  disconnectMaster,
} from './';

const mockStore = configureMockStore([thunk]);

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
      const setAction = { type: 'SET_MASTER_TEAM', color: 'RED' };
      expect(spymastersReducer(initialState, setAction)).toEqual({
        ownTeam: 'RED',
        taken: {
          RED: false,
          BLUE: false,
        },
      });
    });
    it('should handle UNSET_MASTER_TEAM', () => {
      const unsetAction = { type: 'UNSET_MASTER_TEAM' };
      const state = {
        ownTeam: 'RED',
        taken: {
          RED: false,
          BLUE: false,
        },
      };
      expect(spymastersReducer(state, unsetAction)).toEqual(initialState);
    });
    it('should handle MARK_MASTER_TAKEN', () => {
      const markAction = { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: true };
      expect(spymastersReducer(initialState, markAction)).toEqual({
        ownTeam: '',
        taken: {
          RED: true,
          BLUE: false,
        },
      });
      const unmarkAction = { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: false };
      expect(spymastersReducer(initialState, unmarkAction)).toEqual({
        ownTeam: '',
        taken: {
          RED: false,
          BLUE: false,
        },
      });
    });
  });

  describe('thunks', () => {
    let store;
    describe('that start with empty state/db', () => {
      beforeEach(() => {
        store = mockStore(mockStoreInitialState);
        return db.ref('rooms/test').set({
          roomCode: 'test',
          spymasters: {
            RED: false,
            BLUE: false,
          },
        });
      });

      describe('createSpymasters', () => {
        it('creates new spymasters object in db', () => (
          store.dispatch(createSpymasters())
          .then(() => db.ref('rooms/test/spymasters').once('value'))
          .then(snapshot => expect(snapshot.val()).toEqual({ RED: false, BLUE: false }))
        ));
        it('marks both spymasters false', () => (
          store.dispatch(createSpymasters())
          .then(() => {
            expect(store.getActions()).toEqual([
              { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: false },
              { type: 'MARK_MASTER_TAKEN', color: 'BLUE', bool: false },
            ]);
          })
        ));
      });

      describe('listenOnSpymasters', () => {
        afterEach(() => db.ref('rooms/test/spymasters').off());
        it('creates MARK_MASTER_TAKEN actions only if db changes', () => {
          store.dispatch(listenOnSpymasters());
          return db.ref('rooms/test/spymasters/RED').set(true)
          .then(() => db.ref('rooms/test/spymasters/RED').set(true))
          .then(() => {
            expect(store.getActions()).toEqual([
              { type: 'MARK_MASTER_TAKEN', color: 'RED', bool: true },
            ]);
          });
        });
        it('returns a function to stop listening', () => {
          const unsubscribe = store.dispatch(listenOnSpymasters());
          unsubscribe();
          return db.ref('rooms/test/spymasters/RED').set(true)
          .then(() => expect(store.getActions()).toEqual([]));
        });
      });

      describe('claimMaster', () => {
        it('sets spymaster to be taken in db', () => (
          store.dispatch(claimMaster('RED'))
          .then(() => db.ref('rooms/test/spymasters/RED').once('value'))
          .then(snapshot => expect(snapshot.val()).toEqual(true))
        ));
        it('creates SET_MASTER_TEAM to update ownTeam', () => (
          store.dispatch(claimMaster('RED'))
          .then(() => {
            expect(store.getActions()).toEqual([
              { type: 'SET_MASTER_TEAM', color: 'RED' },
            ]);
          })
        ));
      });
    });

    describe('that start with populated state', () => {
      describe('disconnectMaster', () => {
        beforeEach(() => {
          const filledMockState = Object.assign({}, mockStoreInitialState);
          filledMockState.roomCode.value = 'test';
          filledMockState.spymasters.ownTeam = 'RED';
          filledMockState.spymasters.taken.RED = true;
          store = mockStore(filledMockState);
          return db.ref('rooms/test/spymasters/RED').set(true);
        });

        it('sets own team\'s master to false in db', () => (
          store.dispatch(disconnectMaster())
          .then(() => db.ref('rooms/test/spymasters/RED').once('value'))
          .then(snapshot => expect(snapshot.val()).toEqual(false))
        ));

        it('creates UNSET_MASTER_TEAM to remove ownTeam in state', () => (
            store.dispatch(disconnectMaster())
            .then(() => {
              expect(store.getActions()).toEqual([
                { type: 'UNSET_MASTER_TEAM' },
              ]);
            })
        ));
      });
    });
  });
});
