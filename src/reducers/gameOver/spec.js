import { Reducer, Thunk } from 'redux-testkit';
import db from '../../firebase/db';

import gameOverReducer, { initGameOverTracking, checkGameOver } from './';
import {
  mockStoreInitialState,
  seedTestRoom,
} from '../../utils/tests';

describe('Game Over Reducer', () => {
  describe('sync actions', () => {
    const initialState = {
      status: false,
      redRemaining: 8,
      blueRemaining: 8,
      winner: null,
    };
    it('should return initial state', () => {
      expect(gameOverReducer(undefined, {})).toEqual(initialState);
    });
    it('should handle ADD_TO_START_TEAM', () => {
      const action = { type: 'ADD_TO_START_TEAM', team: 'RED' };
      const expectedState = Object.assign({}, initialState);
      expectedState.redRemaining += 1;
      Reducer(gameOverReducer).expect(action).toReturnState(expectedState);
    });
    it('should handle DECREMENT_REMAINING', () => {
      const action = { type: 'DECREMENT_REMAINING', team: 'RED' };
      Reducer(gameOverReducer).expect(action).toChangeInState({ redRemaining: 7 });
    });
    it('should handle SET_WINNER', () => {
      const action = { type: 'SET_WINNER', winner: 'RED' };
      Reducer(gameOverReducer).expect(action).toChangeInState({ status: true, winner: 'RED' });
    });
  });

  describe('thunks', () => {
    describe('initGameOverTracking', () => {
      let actions;
      beforeAll(() => (
        seedTestRoom()
        .then(() => Thunk(initGameOverTracking).withState(mockStoreInitialState).execute('RED'))
        .then(dispatches => { actions = dispatches.map(dispatch => dispatch.getAction()); })
      ));
      it('inserts game status tracking object in db', () => (
        db.ref('rooms/test/gameOver').once('value')
        .then(snapshot => {
          const { status, redRemaining, blueRemaining } = snapshot.val();
          expect(status).toEqual(false);
          expect(redRemaining).toEqual(9);
          expect(blueRemaining).toEqual(8);
        })
      ));
      it('dispatches ADD_TO_START_TEAM', () => {
        expect(actions).toEqual([{ type: 'ADD_TO_START_TEAM', team: 'RED' }]);
      });
    });

    describe('checkGameOver', () => {
      describe('game should become over', () => {
        describe('team guesses all their words', () => {
          let syncDispatches;
          let thunkDispatches;
          beforeAll(() => {
            const mockState = Object.assign({}, mockStoreInitialState);
            mockState.gameOver = {
              status: false,
              redRemaining: 1,
              blueRemaining: 5,
            };
            return seedTestRoom({ gameOver: true })
            .then(() => Thunk(checkGameOver).withState(mockState).execute('RED'))
            .then(dispatches => {
              syncDispatches = [];
              thunkDispatches = [];
              dispatches.forEach(dispatch => {
                if (dispatch.isPlainObject()) syncDispatches.push(dispatch.getAction());
                if (dispatch.isFunction()) thunkDispatches.push(dispatch.getName());
              });
            });
          });
          it('updates db', () => (
            db.ref('rooms/test/gameOver/status').once('value')
            .then(snapshot => expect(snapshot.val()).toEqual(true))
          ));
          it('dispatches SET_WINNER with correct team', () => {
            expect(syncDispatches).toEqual(expect.arrayContaining([{ type: 'SET_WINNER', winner: 'RED' }]));
          });
        });

        describe('team picks assassin card', () => {
          const syncDispatches = [];
          const thunkDispatches = [];
          beforeAll(() => {
            const mockState = Object.assign({}, mockStoreInitialState);
            mockState.currentTurn.team = 'RED';
            return seedTestRoom({ gameOver: true })
            .then(() => Thunk(checkGameOver).withState(mockState).execute('ASSASSIN'))
            .then(dispatches => {
              dispatches.forEach(dispatch => {
                if (dispatch.isPlainObject()) syncDispatches.push(dispatch.getAction());
                if (dispatch.isFunction()) thunkDispatches.push(dispatch.getName());
              });
            });
          });
          it('updates db', () => (
            db.ref('rooms/test/gameOver/status').once('value')
            .then(snapshot => expect(snapshot.val()).toEqual(true))
          ));
          it('dispatches SET_WINNER with winning team', () => {
            expect(syncDispatches).toEqual([{ type: 'SET_WINNER', winner: 'BLUE' }]);
          });
          it('dispatches `endTurn` thunk', () => {
            expect(thunkDispatches).toEqual(['endTurnThunk']);
          });
        });
      });

      describe('game should continue', () => {
        it('simply decrements remaining count as necessary', () => (
          Thunk(checkGameOver).withState(mockStoreInitialState).execute('RED')
          .then(dispatches => {
            expect(dispatches[0].getAction()).toEqual({ type: 'DECREMENT_REMAINING', team: 'RED' });
          })
        ));
      });
    });
  });
});
