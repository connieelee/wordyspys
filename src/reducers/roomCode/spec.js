import { Reducer, Thunk } from 'redux-testkit';
import db from '../../firebase/db';
import roomCodeReducer, { createRoom, deleteRoom } from './';
import { mockStoreInitialState, seedTestRoom } from '../../utils/tests';

describe('Room Code Reducer', () => {
  describe('sync actions', () => {
    const initialState = { value: '', errors: [] };
    const stateWithCode = { value: 'test', errors: [] };
    const error = 'Room does not exist';
    const stateWithError = { value: '', errors: [error] };

    it('should return initial state', () => {
      expect(roomCodeReducer(undefined, {})).toEqual(initialState);
    });
    it('should handle SET_CODE', () => {
      const action = { type: 'SET_CODE', code: 'test' };
      Reducer(roomCodeReducer).expect(action).toReturnState(stateWithCode);
    });
    it('should handle UNSET_CODE', () => {
      const action = { type: 'UNSET_CODE' };
      expect(roomCodeReducer(stateWithCode, action)).toEqual(initialState);
    });
    it('should handle ADD_ERROR', () => {
      const action = { type: 'ADD_ERROR', error };
      Reducer(roomCodeReducer).expect(action).toReturnState(stateWithError);
    });
    it('should handle RESET_ERRORS', () => {
      const action = { type: 'RESET_ERRORS' };
      Reducer(roomCodeReducer).withState(stateWithError).expect(action).toReturnState(initialState);
    });
  });

  describe('thunks', () => {
    describe('createRoom', () => {
      let dispatches;
      let code;
      beforeEach(() => (
        Thunk(createRoom).execute()
        .then(_dispatches => {
          dispatches = _dispatches;
          code = dispatches[0].getAction().code;
        })
      ));
      afterEach(() => db.ref(`rooms/${code}`).remove());
      it('creates new room in db', () => (
        db.ref(`rooms/${code}`).once('value')
        .then(snapshot => expect(snapshot.val().roomCode).toEqual(code))
      ));
      it('dispatches SET_CODE once room has been created', () => {
        expect(dispatches[0].getAction()).toEqual({ type: 'SET_CODE', code });
      });
    });

    describe('deleteRoom', () => {
      let dispatches;
      beforeEach(() => (
        seedTestRoom()
        .then(() => Thunk(deleteRoom).withState(mockStoreInitialState).execute())
        .then(_dispatches => { dispatches = _dispatches; })
      ));
      it('deletes room from db', () => (
        db.ref('rooms/test').once('value')
        .then(snapshot => expect(snapshot.val()).toBeFalsy())
      ));
      it('dispatches UNSET_CODE once room has been deleted', () => {
        expect(dispatches[0].getAction()).toEqual({ type: 'UNSET_CODE' });
      });
    });
  });
});
