import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';

import boardReducer, { createBoard, revealCard } from './';
import {
  mockStoreInitialState,
  seedTestRoom,
  testBoard,
  testKeyCard,
} from '../../utils/tests';

const mockStore = configureMockStore([thunk]);

describe('Board Reducer', () => {
  it('should return initial state', () => {
    expect(boardReducer(undefined, {})).toEqual([]);
  });
  it('should handle SET_BOARD', () => {
    const action = { type: 'SET_BOARD', board: testBoard };
    expect(boardReducer([], action)).toEqual(testBoard);
  });
  it('should handle SET_CARD_STATUS', () => {
    const rowId = 0;
    const colId = 0;
    const status = 'RED';
    const action = { type: 'SET_CARD_STATUS', rowId, colId, status };
    const expectedBoard = [...testBoard];
    expectedBoard[rowId][colId] = Object.assign({}, testBoard[rowId][colId]);
    expectedBoard[rowId][colId].status = status;
    expect(boardReducer(testBoard, action)).toEqual(expectedBoard);
  });

  describe('thunks', () => {
    let store;
    beforeEach(() => { store = mockStore(mockStoreInitialState); });
    describe('createBoard', () => {
      beforeEach(() => seedTestRoom());
      it('updates the db with newly created board', () => (
        store.dispatch(createBoard())
        .then(action => Promise.all([db.ref('rooms/test/board').once('value'), action.board]))
        .then(([snapshot, board]) => expect(snapshot.val()).toEqual(board))
      ));
      it('creates SET_BOARD once board has been created', () => (
        store.dispatch(createBoard())
        .then(action => expect(action.type).toEqual('SET_BOARD'))
      ));
    });

    describe('revealCard', () => {
      const rowId = 0;
      const colId = 0;
      const status = testKeyCard.keys[rowId][colId];
      beforeEach(() => seedTestRoom({ board: true, keyCard: true }));
      it('creates SET_CARD_STATUS based on data from keyCard in db', () => (
        store.dispatch(revealCard(rowId, colId))
        .then(() => {
          const expectedActions = [{ type: 'SET_CARD_STATUS', rowId, colId, status }];
          expect(store.getActions()).toEqual(expectedActions);
        })
      ));
    });
  });
});
