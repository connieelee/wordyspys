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
      Reducer(gameOverReducer).expect(action).toChangeInState({ redRemaining: initialState.redRemaining - 1 });
    });
    it('should handle SET_GAME_OVER', () => {
      const action = { type: 'SET_GAME_OVER' };
      Reducer(gameOverReducer).expect(action).toChangeInState({ status: true });
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
      it('inserts game-status tracking data to db', () => (
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
      fdescribe('game should become over', () => {
        describe('team guesses all their words', () => {
          let actions;
          beforeAll(() => (
            seedTestRoom({ gameOver: true })
            .then(() => (
              Thunk(checkGameOver).withState({
                roomCode: { value: 'test' },
                gameOver: {
                  status: false,
                  redRemaining: 1,
                  blueRemaining: 5,
                },
              }).execute('RED')
              .then(dispatches => { actions = dispatches.map(dispatch => dispatch.getAction()); })
            ))
          ));
          it('updates db', () => (
            db.ref('rooms/test/gameOver/status').once('value')
            .then(snapshot => expect(snapshot.val()).toEqual(true))
          ));
          it('dispatches SET_GAME_OVER with true', () => {
            expect(actions).toEqual([{ type: 'SET_GAME_OVER' }]);
          });
        });

        describe('team picks assassin card', () => {
          let actions;
          beforeAll(() => (
            seedTestRoom({ gameOver: true })
            .then(() => (
              Thunk(checkGameOver).withState({
                roomCode: { value: 'test' },
                gameOver: {
                  status: false,
                  redRemaining: 5,
                  blueRemaining: 5,
                },
              }).execute('ASSASSIN')
              .then(dispatches => { actions = dispatches.map(dispatch => dispatch.getAction()); })
            ))
          ));
          it('updates db', () => (
            db.ref('rooms/test/gameOver/status').once('value')
            .then(snapshot => expect(snapshot.val()).toEqual(true))
          ));
          it('dispatches SET_GAME_OVER', () => {
            expect(actions).toEqual([{ type: 'SET_GAME_OVER' }]);
          });
        });
      });

      describe('game should continue', () => {
        it('nothing happens', () => (
          Thunk(checkGameOver).withState({
            roomCode: { value: 'test' },
            gameOver: {
              status: false,
              redRemaining: 5,
              blueRemaining: 5,
            },
          }).execute('RED')
          .then(dispatches => expect(dispatches).toHaveLength(0))
        ));
      });
    });
  });
});
