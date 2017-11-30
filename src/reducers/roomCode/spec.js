import { Reducer, Thunk } from 'redux-testkit';
import configureMockStore from 'redux-mock-store';
import thunks from 'redux-thunk';
import db from '../../firebase/db';

import roomCodeReducer, {
  createRoom,
  deleteRoom,
  validateCode,
  onRoomDisconnect,
} from './';
import {
  mockStoreInitialState,
  seedTestRoom,
} from '../../utils/tests';

describe('Room Code Reducer', () => {
  const initialState = { value: '', errors: [] };
  const stateWithCode = { value: 'test', errors: [] };

  describe('sync actions', () => {
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
        expect(dispatches[0].getType()).toEqual('SET_CODE');
      });
    });

    describe('deleteRoom', () => {
      let dispatches;
      beforeEach(() => (
        seedTestRoom()
        .then(() => Thunk(deleteRoom).withState({ roomCode: initialState }).execute())
        .then(_dispatches => { dispatches = _dispatches; })
      ));

      it('deletes room from db', () => (
        db.ref('rooms/test').once('value')
        .then(snapshot => expect(snapshot.val()).toBeFalsy())
      ));
      it('dispatches UNSET_CODE once room has been deleted', () => {
        expect(dispatches[0].getType()).toEqual('UNSET_CODE');
      });
    });

    describe('validateCode', () => {
      it('dispatches RESET_ERRORS', () => (
        Thunk(validateCode).execute('test')
        .then(dispatches => {
          const found = dispatches.find(dispatch => dispatch.getType() === 'RESET_ERRORS');
          expect(found).toBeTruthy();
        })
      ));
      it('dispatches ADD_ERROR if no room matches code', () => (
        db.ref('rooms/test').remove()
        .then(() => Thunk(validateCode).execute('test'))
        .then(dispatches => {
          const found = dispatches.map(dispatch => dispatch.getType() === 'ADD_ERROR');
          expect(found).toBeTruthy();
        })
      ));
    });

    describe('onRoomDisconnect', () => {
      describe('when room is removed from db', () => {
        const spy = jest.fn();
        let dispatches;
        beforeEach(() => {
          jest.resetAllMocks();
          dispatches = Thunk(onRoomDisconnect)
            .withState({ roomCode: initialState })
            .execute(spy);
          return db.ref('rooms/test').remove();
        });

        afterEach(() => seedTestRoom());

        it('executes callback', () => {
          expect(spy.mock.calls).toHaveLength(1);
        });
        it('dispatches UNSET_CODE', () => {
          expect(dispatches[0].getType()).toEqual('UNSET_CODE');
        });
      });
      it('returns an unsubscribing function', () => {
        const spy = jest.fn();
        const store = configureMockStore([thunks])(mockStoreInitialState);
        const unsubscribe = store.dispatch(onRoomDisconnect(spy));
        unsubscribe();
        return db.ref('rooms/test').remove()
        .then(() => expect(spy.mock.calls).toHaveLength(0));
      });
    });
  });
});
