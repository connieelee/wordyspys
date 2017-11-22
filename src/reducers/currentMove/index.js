import db from '../../firebase/db';

// constants
const SET_CURRENT_TEAM = 'SET_CURRENT_TEAM';
const SET_CURRENT_CLUE = 'SET_CURRENT_CLUE';
const SET_CURRENT_NUMBER = 'SET_CURRENT_NUMBER';

// actions
const setCurrentTeam = team => ({ type: SET_CURRENT_TEAM, team });
const setCurrentClue = clue => ({ type: SET_CURRENT_CLUE, clue });
const setCurrentNumber = number => ({ type: SET_CURRENT_NUMBER, number });

// thunks
export const createMove = (team, clue, number) => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/currentMove/team`).set(team)
  .then(() => {
    dispatch(setCurrentTeam(team));
    if (clue) dispatch(setCurrentClue(clue));
    if (number) dispatch(setCurrentNumber(number));
  })
);
export const listenOnCurrentMove = () => (dispatch, getState) => {
  const listener = snapshot => {
    if (!snapshot) return;
    if (!snapshot.val()) return;
    const { team: newTeam, clue: newClue, number: newNumber } = snapshot.val();
    const { team: prevTeam, clue: prevClue, number: prevNumber } = getState().currentMove;
    if (newTeam && (newTeam !== prevTeam)) dispatch(setCurrentTeam(newTeam));
    if (newClue && (newClue !== prevClue)) dispatch(setCurrentClue(newClue));
    if (newNumber && (newNumber !== prevNumber)) dispatch(setCurrentNumber(newNumber));
  };
  db.ref(`rooms/${getState().roomCode.value}/currentMove`).on('value', listener);
  return listener;
};

// reducer
const initialState = {
  team: 'Pending',
  clue: null,
  number: null,
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
    default:
      return prevState;
  }
}
