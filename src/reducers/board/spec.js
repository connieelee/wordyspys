import { Reducer, Thunk } from 'redux-testkit';
import configureMockStore from 'redux-mock-store';
import thunks from 'redux-thunk';
import db from '../../firebase/db';

import boardReducer, { createBoard, listenOnBoard, revealCard } from './';
import {
  mockStoreInitialState,
  seedTestRoom,
  testBoard,
  testKeyCard,
} from '../../utils/tests';

describe('Board Reducer', () => {
  describe('sync actions', () => {
    it('should return initial state', () => {
      expect(boardReducer(undefined, {})).toEqual([]);
    });
    it('should handle SET_BOARD', () => {
      const action = { type: 'SET_BOARD', board: testBoard };
      Reducer(boardReducer).expect(action).toReturnState(testBoard);
    });
    it('should handle SET_CARD_STATUS', () => {
      const action = { type: 'SET_CARD_STATUS', rowId: 0, colId: 0, status: 'RED' };
      const expectedBoard = [...testBoard];
      expectedBoard[0][0] = Object.assign({}, testBoard[0][0]);
      expectedBoard[0][0].status = 'RED';
      Reducer(boardReducer)
        .withState(testBoard)
        .expect(action)
        .toReturnState(expectedBoard);
    });
  });

  describe('thunks', () => {
    describe('createBoard', () => {
      let dispatches;
      beforeAll(() => (
        seedTestRoom()
        .then(() => Thunk(createBoard).withState(mockStoreInitialState).execute())
        .then(_dispatches => { dispatches = _dispatches; })
      ));
      it('updates the db with newly created board', () => (
        db.ref('rooms/test/board').once('value')
        .then(snapshot => expect(snapshot.val()).toEqual(dispatches[0].getAction().board))
      ));
      it('dispatches SET_BOARD', () => {
        expect(dispatches[0].getType()).toEqual('SET_BOARD');
      });
    });

    describe('listenOnBoard', () => {
      afterEach(() => db.ref('rooms/test/board').off());
      it('dispatches SET_BOARD on change', () => {
        const dispatches = Thunk(listenOnBoard).withState(mockStoreInitialState).execute();
        return db.ref('rooms/test/board/0/0/status').set('RED')
        .then(() => {
          const types = dispatches.map(dispatch => dispatch.getType());
          expect(types).toEqual(['SET_BOARD']);
        });
      });
      it('returns an unsubscribing function', () => {
        const store = configureMockStore([thunks])(mockStoreInitialState);
        const unsubscribe = store.dispatch(listenOnBoard());
        unsubscribe();
        return db.ref('rooms/test/board/0/0/status').set('RED')
        .then(() => expect(store.getActions()).toEqual([]));
      });
    });

    describe('revealCard', () => {
      const rowId = 0;
      const colId = 0;
      const status = testKeyCard.keys[rowId][colId];
      const dispatchedSyncActions = [];
      const dispatchedThunks = [];
      beforeAll(() => (
        seedTestRoom({ board: true, keyCard: true })
        .then(() => Thunk(revealCard).withState(mockStoreInitialState).execute(rowId, colId))
        .then(dispatches => {
          dispatches.forEach(dispatch => {
            if (dispatch.isPlainObject()) dispatchedSyncActions.push(dispatch.getAction());
            if (dispatch.isFunction()) dispatchedThunks.push(dispatch.getName());
          });
        })
      ));

      it('dispatches SET_CARD_STATUS with correct values', () => {
        const expectedSyncActions = [{ type: 'SET_CARD_STATUS', rowId, colId, status }];
        expect(dispatchedSyncActions).toEqual(expectedSyncActions);
      });
      it('dispatches `validateTurn` thunk', () => {
        expect(dispatchedThunks).toEqual(['validateTurnThunk']);
      });
      it('updates board card status in db', () => (
        db.ref('rooms/test/board/0/0/status').once('value')
        .then(snapshot => expect(snapshot.val()).toEqual(status))
      ));
    });
  });
});
