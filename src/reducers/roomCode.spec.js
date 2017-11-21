import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../firebase/db';
import roomCodeReducer, { createRoomCode } from './roomCode';

const mockStore = configureMockStore([thunk]);

describe('Reducers', () => {
  describe('Room Code', () => {
    it('should return initial state', () => {
      expect(roomCodeReducer(undefined, {})).toEqual('');
    });
    it('should handle SET_CODE', () => {
      const setAction = { type: 'SET_CODE', code: 'test' };
      expect(roomCodeReducer([], setAction)).toEqual('test');
    });
    describe('thunks', () => {
      let store;
      let code;
      beforeEach(() => {
        store = mockStore({});
        return db.ref(`rooms/${code}`).remove();
      });
      describe('createRoomCode', () => {
        it('creates SET_CODE once code has been created', () => (
          store.dispatch(createRoomCode())
          .then(action => {
            code = action.code;
            expect(action.type).toEqual('SET_CODE');
          })
        ));
        it('creates new room in db', () => (
          store.dispatch(createRoomCode())
          .then(action => db.ref(`rooms/${action.code}`).once('value'))
          .then(snapshot => expect(snapshot.val()).toBeTruthy())
        ));
      });
    });
  });
});
