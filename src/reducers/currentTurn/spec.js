import { Reducer, Thunk } from 'redux-testkit';
import configureMockStore from 'redux-mock-store';
import thunks from 'redux-thunk';
import db from '../../firebase/db';

import currentTurnReducer, {
  resetCurrentTurn,
  createTurn,
  listenOnCurrentTurn,
  giveClue,
  makeGuess,
  checkTurnOver,
  endTurn,
} from './';
import {
  mockStoreInitialState,
  seedTestRoom,
} from '../../utils/tests';

describe('Current Turn Reducer', () => {
  describe('sync actions', () => {
    const initialState = {
      team: 'Pending',
      clue: null,
      number: null,
      guesses: [],
      isOver: false,
    };

    it('should return initial state', () => {
      expect(currentTurnReducer(undefined, {})).toEqual(initialState);
    });
    it('should handle SET_CURRENT_TEAM', () => {
      const action = { type: 'SET_CURRENT_TEAM', team: 'RED' };
      Reducer(currentTurnReducer).expect(action).toChangeInState({ team: 'RED' });
    });
    it('should handle SET_CURRENT_CLUE', () => {
      const action = { type: 'SET_CURRENT_CLUE', clue: 'hello' };
      Reducer(currentTurnReducer).expect(action).toChangeInState({ clue: 'hello' });
    });
    it('should handle SET_CURRENT_NUMBER', () => {
      const action = { type: 'SET_CURRENT_NUMBER', number: 3 };
      Reducer(currentTurnReducer).expect(action).toChangeInState({ number: 3 });
    });
    it('should handle SET_TURN_OVER', () => {
      const overAction = { type: 'SET_TURN_OVER', isOver: true };
      Reducer(currentTurnReducer).expect(overAction).toChangeInState({ isOver: true });
      const notOverAction = { type: 'SET_TURN_OVER', isOver: false };
      Reducer(currentTurnReducer).expect(notOverAction).toChangeInState({ isOver: false });
    });
    it('should handle ADD_GUESS', () => {
      const action = { type: 'ADD_GUESS', word: 'ALPS' };
      Reducer(currentTurnReducer).expect(action).toChangeInState({ guesses: ['ALPS'] });
    });
    it('should handle CLEAR_GUESSES', () => {
      const action = { type: 'CLEAR_GUESSES' };
      Reducer(currentTurnReducer)
        .withState(Object.assign({ guesses: ['ALPS'] }, initialState))
        .expect(action)
        .toChangeInState({ guesses: [] });
    });
  });

  describe('thunks', () => {
    describe('resetCurrentTurn', () => {
      it('dispatches the actions to clear currentTurn state', () => {
        const actions = Thunk(resetCurrentTurn).execute('RED').map(dispatch => dispatch.getAction());
        expect(actions).toEqual(expect.arrayContaining([
          { type: 'SET_CURRENT_TEAM', team: 'RED' },
          { type: 'SET_CURRENT_CLUE', clue: null },
          { type: 'SET_CURRENT_NUMBER', number: null },
          { type: 'SET_TURN_OVER', isOver: false },
          { type: 'CLEAR_GUESSES' },
        ]));
      });
    });

    describe('createTurn', () => {
      let thunkNames;
      beforeAll(() => (
        seedTestRoom()
        .then(() => Thunk(createTurn).withState(mockStoreInitialState).execute('RED'))
        .then(dispatches => { thunkNames = dispatches.map(dispatch => dispatch.getName()); })
      ));
      it('inserts an empty current turn in db', () => (
        db.ref('rooms/test/currentTurn').once('value')
        .then(snapshot => {
          const { team, isOver } = snapshot.val();
          expect(team).toEqual('RED');
          expect(isOver).toEqual(false);
        })
      ));
      it('dispatches `resetCurrentTurn` thunk', () => {
        expect(thunkNames).toEqual(['resetCurrentTurnThunk']);
      });
    });

    describe('listenOnCurrentTurn', () => {
      afterEach(() => db.ref('rooms/test/currentTurn').off());
      it('dispatches SET actions on updates to team, clue, number, & isOver', () => {
        const dispatches = Thunk(listenOnCurrentTurn).withState(mockStoreInitialState).execute();
        const ref = db.ref('rooms/test/currentTurn');
        return Promise.all([
          ref.child('team').set('RED'),
          ref.child('clue').set('clue'),
          ref.child('number').set(2),
          ref.child('isOver').set(true),
        ])
        .then(() => {
          const actions = dispatches.map(dispatch => dispatch.getAction());
          expect(actions).toEqual([
            { type: 'SET_CURRENT_TEAM', team: 'RED' },
            { type: 'SET_CURRENT_CLUE', clue: 'clue' },
            { type: 'SET_CURRENT_NUMBER', number: 2 },
            { type: 'SET_TURN_OVER', isOver: true },
          ]);
        });
      });
      it('returns an unsubscribing function', () => {
        const store = configureMockStore([thunks])(mockStoreInitialState);
        const unsubscribe = store.dispatch(listenOnCurrentTurn());
        unsubscribe();
        return db.ref('rooms/test/currentTurn').set('RED')
        .then(() => expect(store.getActions()).toEqual([]));
      });
    });

    describe('giveClue', () => {
      let actions;
      beforeAll(() => (
        seedTestRoom()
        .then(() => Thunk(giveClue).withState(mockStoreInitialState).execute('clue', 2))
        .then(dispatches => { actions = dispatches.map(dispatch => dispatch.getAction()); })
      ));
      it('updates db with clue and number values', () => (
        db.ref('rooms/test/currentTurn').once('value')
        .then(snapshot => {
          const { clue, number } = snapshot.val();
          expect(clue).toEqual('clue');
          expect(number).toEqual(2);
        })
      ));
      it('dispatches SET_CURRENT_CLUE and SET_CURRENT_NUMBER', () => {
        expect(actions).toEqual([
          { type: 'SET_CURRENT_CLUE', clue: 'clue' },
          { type: 'SET_CURRENT_NUMBER', number: 2 },
        ]);
      });
    });

    describe('makeGuess', () => {
      const executeMakeGuess = state => Thunk(makeGuess).withState(state).execute('ALPS', 0, 0);
      describe('guessing is not open', () => {
        it('does nothing if no clue/number has been given', () => {
          const state = { currentTurn: { clue: null, number: null } };
          const dispatches = executeMakeGuess(state);
          expect(dispatches).toHaveLength(0);
        });
        it('does nothing if the turn is over', () => {
          const state = { currentTurn: { isOver: true } };
          const dispatches = executeMakeGuess(state);
          expect(dispatches).toHaveLength(0);
        });
      });

      describe('guessing is open', () => {
        const syncActionTypes = [];
        const thunkNames = [];
        executeMakeGuess({ currentTurn: { clue: 'clue', number: 2, isOver: false } })
          .forEach(dispatch => {
            if (dispatch.isPlainObject()) syncActionTypes.push(dispatch.getType());
            if (dispatch.isFunction()) thunkNames.push(dispatch.getName());
          });
        it('dispatches ADD_GUESS', () => {
          expect(syncActionTypes).toEqual(['ADD_GUESS']);
        });
        it('dispatches `revealCard` thunk', () => {
          expect(thunkNames).toEqual(['revealCardThunk']);
        });
      });
    });

    describe('checkTurnOver', () => {
      describe('turn should be over', () => {
        describe('team already made maximum number of guesses', () => {
          let actions;
          beforeAll(() => (
            db.ref('rooms/test/currentTurn/isOver').set(false)
            .then(() => (
              Thunk(checkTurnOver).withState({
                roomCode: { value: 'test' },
                currentTurn: {
                  team: 'RED',
                  number: 2,
                  guesses: ['ALPS', 'FORK', 'FRANCE'],
                },
              }).execute('RED')
              .then(dispatches => { actions = dispatches.map(dispatch => dispatch.getAction()); })
            ))
          ));
          it('updates db', () => (
            db.ref('rooms/test/currentTurn/isOver').once('value')
            .then(snapshot => expect(snapshot.val()).toEqual(true))
          ));
          it('dispatches SET_TURN_OVER with true', () => {
            expect(actions).toEqual([{ type: 'SET_TURN_OVER', isOver: true }]);
          });
        });

        describe('team picks a card that is not theirs', () => {
          let actions;
          beforeAll(() => (
            db.ref('rooms/test/currentTurn/isOver').set(false)
            .then(() => (
              Thunk(checkTurnOver).withState({
                roomCode: { value: 'test' },
                currentTurn: {
                  team: 'RED',
                  number: 2,
                  guesses: ['ALPS', 'FORK'],
                },
              }).execute('BLUE')
              .then(dispatches => { actions = dispatches.map(dispatch => dispatch.getAction()); })
            ))
          ));
          it('updates db', () => (
            db.ref('rooms/test/currentTurn/isOver').once('value')
            .then(snapshot => expect(snapshot.val()).toEqual(true))
          ));
          it('dispatches SET_TURN_OVER with true', () => {
            expect(actions).toEqual([{ type: 'SET_TURN_OVER', isOver: true }]);
          });
        });
      });

      describe('turn should continue', () => {
        it('nothing happens', () => (
          Thunk(checkTurnOver).withState({
            currentTurn: {
              team: 'RED',
              number: 2,
              guesses: ['ALPS'],
            },
          }).execute('RED')
          .then(dispatches => expect(dispatches).toHaveLength(0))
        ));
      });
    });

    describe('endTurn', () => {
      const sampleTurn = {
        team: 'RED',
        clue: 'clue',
        number: 2,
        guesses: ['ALPS', 'FORK'],
        isOver: true,
      };
      const syncActionTypes = [];
      const thunkNames = [];
      beforeAll(() => (
        db.ref('rooms/test/pastTurns').remove()
        .then(() => (
          Thunk(endTurn).withState({
            roomCode: { value: 'test' },
            currentTurn: sampleTurn,
          }).execute()
          .then(dispatches => {
            dispatches.forEach(dispatch => {
              if (dispatch.isPlainObject()) syncActionTypes.push(dispatch.getType());
              if (dispatch.isFunction()) thunkNames.push(dispatch.getName());
            });
          })
        ))
      ));
      it('pushes currently ending turn into pastTurns in db', () => (
        db.ref('rooms/test/pastTurns').once('value')
        .then(snapshot => {
          const pastTurns = Object.values(snapshot.val());
          expect(pastTurns).toEqual(expect.arrayContaining([sampleTurn]));
        })
      ));
      it('dispatches `createTurn`', () => {
        expect(thunkNames).toEqual(['createTurnThunk']);
      });
      it('dispatches CLEAR_GUESSES', () => {
        expect(syncActionTypes).toEqual(['CLEAR_GUESSES']);
      });
    });
  });
});
