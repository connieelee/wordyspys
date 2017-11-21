import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import db from '../../firebase/db';
import roomCodeReducer, { createRoom, deleteRoom } from './';

const mockStore = configureMockStore([thunk]);

describe('Room Code Reducer', () => {
  const initialState = {
    value: '',
    errors: [],
  };

  it('should return initial state', () => {
    expect(roomCodeReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle SET_CODE', () => {
    const setAction = { type: 'SET_CODE', code: 'test' };
    expect(roomCodeReducer(initialState, setAction)).toEqual({
      value: 'test',
      errors: [],
    });
  });
  it('should handle UNSET_CODE', () => {
    const setAction = { type: 'UNSET_CODE' };
    const state = {
      value: 'test',
      errors: [],
    };
    expect(roomCodeReducer(state, setAction)).toEqual(initialState);
  });

  describe('thunks', () => {
    let store;
    let code;
    beforeEach(() => {
      store = mockStore({ roomCode: initialState });
      return db.ref('rooms/test').set({ roomCode: 'test' });
    });

    describe('createRoom', () => {
      afterEach(() => db.ref(`rooms/${code}`).remove());

      it('creates new room in db', () => (
        store.dispatch(createRoom())
        .then(action => {
          code = action.code;
          return db.ref(`rooms/${action.code}`).once('value');
        })
        .then(snapshot => expect(snapshot.val().roomCode).toEqual(code))
      ));
      it('creates SET_CODE once room has been created', () => (
        store.dispatch(createRoom())
        .then(action => {
          code = action.code;
          expect(action.type).toEqual('SET_CODE');
        })
      ));
    });

    describe('deleteRoom', () => {
      afterEach(() => db.ref('rooms/test').set({ roomCode: 'test' }));

      it('deletes room from db', () => (
        store.dispatch(deleteRoom())
        .then(() => db.ref('rooms/test').once('value'))
        .then(snapshot => expect(snapshot.val()).toBeFalsy())
      ));
      it('creates UNSET_CODE once room has been deleted', () => (
        store.dispatch(deleteRoom())
        .then(action => expect(action.type).toEqual('UNSET_CODE'))
      ));
    });
  });
});
