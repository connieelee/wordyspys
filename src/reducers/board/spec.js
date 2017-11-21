import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';
import boardReducer, { createBoard } from './';

const mockStore = configureMockStore([thunk]);

describe('Reducers', () => {
  describe('Board', () => {
    const testBoard = [
      [
        { word: 'ALPS', status: 'UNKNOWN' },
        { word: 'FORK', status: 'UNKNOWN' },
        { word: 'SNAKE', status: 'UNKNOWN' },
        { word: 'CAT', status: 'UNKNOWN' },
        { word: 'CODE', status: 'UNKNOWN' },
      ],
      [
        { word: 'STRING', status: 'UNKNOWN' },
        { word: 'MURDER', status: 'UNKNOWN' },
        { word: 'JACK', status: 'UNKNOWN' },
        { word: 'SNOWMAN', status: 'UNKNOWN' },
        { word: 'LOCH NESS', status: 'UNKNOWN' },
      ],
      [
        { word: 'HIMALAYAS', status: 'UNKNOWN' },
        { word: 'FRANCE', status: 'UNKNOWN' },
        { word: 'SOLDIER', status: 'UNKNOWN' },
        { word: 'ARM', status: 'UNKNOWN' },
        { word: 'ANGEL', status: 'UNKNOWN' },
      ],
      [
        { word: 'MAGIC', status: 'UNKNOWN' },
        { word: 'BEAR', status: 'UNKNOWN' },
        { word: 'DANCE', status: 'UNKNOWN' },
        { word: 'WORD', status: 'UNKNOWN' },
        { word: 'OCTOPUS', status: 'UNKNOWN' },
      ],
      [
        { word: 'EYGPT', status: 'UNKNOWN' },
        { word: 'GREECE', status: 'UNKNOWN' },
        { word: 'JELLY', status: 'UNKNOWN' },
        { word: 'DOG', status: 'UNKNOWN' },
        { word: 'BIRD', status: 'UNKNOWN' },
      ],
    ];
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
        store = mockStore({ roomCode: 'test' });
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
});
