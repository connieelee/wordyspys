import db from '../../firebase/db';

// constants
const ADD_TO_START_TEAM = 'ADD_TO_START_TEAM';
const SET_GAME_OVER = 'SET_GAME_OVER';
const DECREMENT_REMAINING = 'DECREMENT_REMAINING';

// actions
const addCountToStartTeam = team => ({ type: ADD_TO_START_TEAM, team });
const setGameOver = () => ({ type: SET_GAME_OVER });
const decrementRemaining = team => ({ type: DECREMENT_REMAINING, team });

// thunks
export const initGameOverTracking = startTeam => (
  function initGameOverTrackingThunk(dispatch, getState) {
    dispatch(addCountToStartTeam(startTeam));
    const { roomCode, gameOver } = getState();
    const updatedGameTracker = Object.assign({}, gameOver);
    if (startTeam === 'RED') updatedGameTracker.redRemaining += 1;
    if (startTeam === 'BLUE') updatedGameTracker.blueRemaining += 1;
    return db.ref(`rooms/${roomCode.value}/gameOver`).set(updatedGameTracker);
  }
);
export const checkGameOver = selectedCardKey => (
  function checkGameOverThunk(dispatch, getState) {
    const { roomCode, gameOver } = getState();
    const gameOverRef = db.ref(`rooms/${roomCode.value}/gameOver`);
    const pickedAssassin = selectedCardKey === 'ASSASSIN';
    const redFinish = selectedCardKey === 'RED' && gameOver.redRemaining === 1;
    const blueFinish = selectedCardKey === 'BLUE' && gameOver.blueRemaining === 1;
    if (pickedAssassin || redFinish || blueFinish) {
      dispatch(setGameOver());
      return gameOverRef.child('status').set(true);
    }
    dispatch(decrementRemaining(selectedCardKey));
    return Promise.resolve(null);
  }
);

// reducer
const initialState = {
  status: false,
  blueRemaining: 8,
  redRemaining: 8,
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
    case SET_GAME_OVER:
      nextState.status = true;
      return nextState;
    default:
      return prevState;
  }
}
