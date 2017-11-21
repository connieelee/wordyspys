import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';
import boardReducer, { createBoard } from './';

import mockStoreInitialState from '../../utils/mockStoreInitialState';
import testBoard from '../../../seed/room/board';

const mockStore = configureMockStore([thunk]);

describe('Board Reducer', () => {
  it('should return initial state', () => {
    expect(boardReducer(undefined, {})).toEqual([]);
  });
  it('should handle SET_BOARD', () => {
    const setAction = { type: 'SET_BOARD', board: testBoard };
    expect(boardReducer([], setAction)).toEqual(testBoard);
  });

  describe('thunks', () => {
    let store;
    beforeEach(() => {
      store = mockStore(mockStoreInitialState);
      return db.ref('rooms/test').set({ roomCode: 'test' });
    });

    describe('createBoard', () => {
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
  });
});
