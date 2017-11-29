import db from '../../firebase/db';
import { revealCard } from '../actionCreators';

// constants
const SET_CURRENT_TEAM = 'SET_CURRENT_TEAM';
const SET_CURRENT_CLUE = 'SET_CURRENT_CLUE';
const SET_CURRENT_NUMBER = 'SET_CURRENT_NUMBER';
const SET_TURN_OVER = 'SET_TURN_OVER';
const ADD_GUESSES = 'ADD_GUESSES';
const CLEAR_GUESSES = 'CLEAR_GUESSES';

// actions
const setCurrentTeam = team => ({ type: SET_CURRENT_TEAM, team });
const setCurrentClue = clue => ({ type: SET_CURRENT_CLUE, clue });
const setCurrentNumber = number => ({ type: SET_CURRENT_NUMBER, number });
const setTurnOver = isOver => ({ type: SET_TURN_OVER, isOver });
const addGuess = word => ({ type: ADD_GUESSES, word });
const clearGuesses = () => ({ type: CLEAR_GUESSES });

// thunks
export const createTurn = team => (
  function createTurnThunk(dispatch, getState) {
    return db.ref(`rooms/${getState().roomCode.value}/currentTurn`).set({
      team,
      isOver: false,
    })
    .then(() => dispatch(setCurrentTeam(team)))
    .catch(err => console.error(err));
  }
);
export const listenOnCurrentTurn = () => (
  function listenOnCurrentTurnThunk(dispatch, getState) {
    const ref = db.ref(`rooms/${getState().roomCode.value}/currentTurn`);
    const listener = snapshot => {
      if (!snapshot) return;
      if (!snapshot.val()) return;
      const { team, clue, number, isOver } = snapshot.val();
      dispatch(setCurrentTeam(team));
      dispatch(setCurrentClue(clue));
      dispatch(setCurrentNumber(number));
      dispatch(setTurnOver(isOver));
    };
    ref.on('value', listener);
    return () => ref.off('value', listener);
  }
);
export const giveClue = (clue, number) => (
  function giveClueThunk(dispatch, getState) {
    const turnRef = db.ref(`rooms/${getState().roomCode.value}/currentTurn`);
    return turnRef.child('clue').set(clue)
    .then(() => turnRef.child('number').set(number))
    .then(() => {
      dispatch(setCurrentClue(clue));
      dispatch(setCurrentNumber(number));
    })
    .catch(err => console.error(err));
  }
);
export const makeGuess = (word, rowId, colId) => (
  function makeGuessThunk(dispatch, getState) {
    const currentTurn = getState().currentTurn;
    if (currentTurn.clue && currentTurn.number && !currentTurn.isOver) {
      dispatch(addGuess(word));
      dispatch(revealCard(rowId, colId));
    }
  }
);
export const validateTurn = selectedCardKey => (
  function validateTurnThunk(dispatch, getState) {
    const { guesses, number, team } = getState().currentTurn;
    // TODO: teamPassed
    const outOfGuesses = guesses.length === number + 1;
    const notOurs = selectedCardKey !== team;
    if (!(outOfGuesses || notOurs)) return null;
    return db.ref(`rooms/${getState().roomCode.value}/currentTurn/isOver`).set(true)
    .then(() => dispatch(setTurnOver(true)))
    .catch(err => console.error(err));
  }
);
export const endTurn = () => (
  function endTurnThunk(dispatch, getState) {
    const { roomCode, currentTurn } = getState();
    const roomRef = db.ref(`rooms/${roomCode.value}`);
    return roomRef.child('currentTurn').once('value')
    .then(snapshot => {
      const nextTeam = currentTurn.team === 'RED' ? 'BLUE' : 'RED';
      return Promise.all([
        roomRef.child('pastTurns').push(snapshot.val()),
        dispatch(createTurn(nextTeam)),
        dispatch(clearGuesses()),
      ]);
    })
    .catch(err => console.error(err));
  }
);

// reducer
const initialState = {
  team: 'Pending',
  clue: null,
  number: null,
  guesses: [],
  isOver: false,
};
export default function (prevState = initialState, action) {
  const nextState = Object.assign({}, prevState);
  switch (action.type) {
    case SET_CURRENT_TEAM:
      nextState.team = action.team;
      return nextState;
    case SET_CURRENT_CLUE:
      nextState.clue = action.clue;
      return nextState;
    case SET_CURRENT_NUMBER:
      nextState.number = action.number;
      return nextState;
    case SET_TURN_OVER:
      nextState.isOver = action.isOver;
      return nextState;
    case ADD_GUESSES:
      nextState.guesses = [...prevState.guesses, action.word];
      return nextState;
    case CLEAR_GUESSES:
      nextState.guesses = [];
      return nextState;
    default:
      return prevState;
  }
}
