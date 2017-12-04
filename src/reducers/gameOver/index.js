import db from '../../firebase/db';
import { endTurn } from '../actionCreators';

// constants
const ADD_TO_START_TEAM = 'ADD_TO_START_TEAM';
const SET_WINNER = 'SET_WINNER';
const DECREMENT_REMAINING = 'DECREMENT_REMAINING';

// actions
const addCountToStartTeam = team => ({ type: ADD_TO_START_TEAM, team });
const setWinner = winner => ({ type: SET_WINNER, winner });
const decrementRemaining = team => ({ type: DECREMENT_REMAINING, team });

// thunks
export const initGameOverTracking = startTeam => (
  function initGameOverTrackingThunk(dispatch, getState) {
    dispatch(addCountToStartTeam(startTeam));
    return db.ref(`rooms/${getState().roomCode.value}/gameOver`).set({
      status: false,
      redRemaining: startTeam === 'RED' ? 9 : 8,
      blueRemaining: startTeam === 'BLUE' ? 9 : 8,
    });
  }
);
export const checkGameOver = selectedCardKey => (
  function checkGameOverThunk(dispatch, getState) {
    const { roomCode, gameOver, currentTurn } = getState();
    const gameOverRef = db.ref(`rooms/${roomCode.value}/gameOver`);

    const pickedAssassin = selectedCardKey === 'ASSASSIN';
    if (pickedAssassin) {
      dispatch(setWinner(currentTurn.team === 'RED' ? 'BLUE' : 'RED'));
      return gameOverRef.child('status').set(true)
      .then(() => dispatch(endTurn()))
      .catch(err => console.error(err));
    }

    let toUpdate;
    if (selectedCardKey === 'RED') toUpdate = 'redRemaining';
    if (selectedCardKey === 'BLUE') toUpdate = 'blueRemaining';
    if (!toUpdate) return Promise.resolve(null);
    return gameOverRef.child(toUpdate).set(gameOver[toUpdate] - 1)
    .then(() => {
      dispatch(decrementRemaining(selectedCardKey));
      const redFinish = selectedCardKey === 'RED' && gameOver.redRemaining === 1;
      const blueFinish = selectedCardKey === 'BLUE' && gameOver.blueRemaining === 1;
      if (!(redFinish || blueFinish)) return null;
      dispatch(setWinner(selectedCardKey));
      return gameOverRef.child('status').set(true)
      .then(() => dispatch(endTurn()))
      .catch(err => console.error(err));
    });
  }
);

// reducer
const initialState = {
  status: false,
  blueRemaining: 8,
  redRemaining: 8,
  winner: null,
};
export default function (prevState = initialState, action) {
  const nextState = Object.assign({}, prevState);
  switch (action.type) {
    case ADD_TO_START_TEAM:
      if (action.team === 'RED') nextState.redRemaining += 1;
      if (action.team === 'BLUE') nextState.blueRemaining += 1;
      return nextState;
    case DECREMENT_REMAINING:
      if (action.team === 'RED') nextState.redRemaining -= 1;
      if (action.team === 'BLUE') nextState.blueRemaining -= 1;
      return nextState;
    case SET_WINNER:
      nextState.status = true;
      nextState.winner = action.winner;
      return nextState;
    default:
      return prevState;
  }
}
