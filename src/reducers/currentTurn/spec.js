import { Reducer, Thunk } from 'redux-testkit';
import configureMockStore from 'redux-mock-store';
import thunks from 'redux-thunk';
import db from '../../firebase/db';

import currentTurnReducer, {
  createTurn,
  listenOnCurrentTurn,
  giveClue,
  makeGuess,
  validateTurn,
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
    it('should handle ADD_GUESSES', () => {
      const action = { type: 'ADD_GUESSES', word: 'ALPS' };
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

  describe.only('thunks', () => {
    describe('createTurn', () => {
      it('inserts minimal turn data in db');
      it('dispatches SET_CURRENT_TEAM with starting team');
    });

    describe('listenOnCurrentTurn', () => {
      it('dispatches SET actions on updates to team, clue, number, & isOver');
      it('returns an unsubscribing function');
    });

    describe('giveClue', () => {
      it('updates db with clue and number values');
      it('dispatches SET_CURRENT_CLUE and SET_CURRENT_NUMBER');
    });

    describe('makeGuess', () => {
      it('dispatches ADD_GUESS');
      it('dispatches `revealCard` thunk');
      it('only allows guesses while there is an active turn with a clue/number');
    });

    describe('validateTurn', () => {
      it('does nothing if everyting is fine');
      const expectations = () => {
        it('updates db');
        it('dispatches SET_TURN_OVER with true');
      };
      describe('team makes maximum number of guesses', expectations);
      describe('team picks a card that is not theirs', expectations);
    });

    describe('endTurn', () => {
      it('pushes currently ending turn into pastTurns in db');
      it('dispatches `createTurn` thunk with next team');
      it('dispatches CLEAR_GUESSES');
    });
  });
});
