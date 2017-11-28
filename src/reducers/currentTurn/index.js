import db from '../../firebase/db';

// constants
const SET_CURRENT_TEAM = 'SET_CURRENT_TEAM';
const SET_CURRENT_CLUE = 'SET_CURRENT_CLUE';
const SET_CURRENT_NUMBER = 'SET_CURRENT_NUMBER';
const SET_TURN_OVER = 'SET_TURN_OVER';
const ADD_GUESSES = 'ADD_GUESSES';

// actions
const setCurrentTeam = team => ({ type: SET_CURRENT_TEAM, team });
const setCurrentClue = clue => ({ type: SET_CURRENT_CLUE, clue });
const setCurrentNumber = number => ({ type: SET_CURRENT_NUMBER, number });
const setTurnOver = () => ({ type: SET_TURN_OVER });
export const addGuess = word => ({ type: ADD_GUESSES, word });

// thunks
export const createTurn = (team, clue = null, number = null) => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/currentTurn`).set({
    team,
    clue,
    number,
    isOver: false,
  })
  .then(() => {
    dispatch(setCurrentTeam(team));
    if (clue) dispatch(setCurrentClue(clue));
    if (number) dispatch(setCurrentNumber(number));
  })
  .catch(err => console.error(err))
);
export const listenOnCurrentTurn = () => (dispatch, getState) => {
  const ref = db.ref(`rooms/${getState().roomCode.value}/currentTurn`);
  const listener = snapshot => {
    if (!snapshot) return;
    if (!snapshot.val()) return;
    const { team: newTeam, clue: newClue, number: newNumber, isOver } = snapshot.val();
    const { team: prevTeam, clue: prevClue, number: prevNumber } = getState().currentTurn;
    if (newTeam && (newTeam !== prevTeam)) dispatch(setCurrentTeam(newTeam));
    if (newClue && (newClue !== prevClue)) dispatch(setCurrentClue(newClue));
    if (newNumber && (newNumber !== prevNumber)) dispatch(setCurrentNumber(newNumber));
    if (isOver) dispatch(setTurnOver());
  };
  ref.on('value', listener);
  return () => ref.off('value', listener);
};
export const giveClue = (clue, number) => (dispatch, getState) => {
  const turnRef = db.ref(`rooms/${getState().roomCode.value}/currentTurn`);
  turnRef.child('clue').set(clue)
  .then(() => turnRef.child('number').set(number))
  .then(() => {
    dispatch(setCurrentClue(clue));
    dispatch(setCurrentNumber(number));
  })
  .catch(err => console.error(err));
};
export const validateTurn = selectedCardKey => (dispatch, getState) => {
  const { guesses, number, team } = getState().currentTurn;
  // TODO: teamPassed
  const outOfGuesses = guesses.length === number + 1;
  const notOurs = selectedCardKey !== team;
  if (!(outOfGuesses || notOurs)) return null;
  return db.ref(`rooms/${getState().roomCode.value}/currentTurn/isOver`).set(true)
  .then(() => dispatch(setTurnOver()))
  .catch(err => console.error(err));
};

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
      nextState.isOver = true;
      return nextState;
    case ADD_GUESSES:
      nextState.guesses = [...prevState.guesses, action.word];
      return nextState;
    default:
      return prevState;
  }
}
