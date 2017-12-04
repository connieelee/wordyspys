import db from '../../firebase/db';
import { generateKeyCard } from '../../utils/game';
import { createTurn, initGameOverTracking } from '../actionCreators';

// constants
const SET_KEY_CARD = 'SET_KEY_CARD';

// actions
const setKeyCard = keyCard => ({ type: SET_KEY_CARD, keyCard });

// thunks
export const createKeyCard = () => (
  function createKeyCardThunk(dispatch, getState) {
    const keyCard = generateKeyCard();
    return db.ref(`rooms/${getState().roomCode.value}/keyCard`).set(keyCard)
    .then(() => {
      dispatch(createTurn(keyCard.startingTeam));
      dispatch(initGameOverTracking(keyCard.startingTeam));
    })
    .catch(err => console.error(err));
  }
);
export const readKeyCard = () => (
  function readKeyCardThunk(dispatch, getState) {
    return db.ref(`rooms/${getState().roomCode.value}/keyCard`).once('value')
    .then(snapshot => {
      if (!snapshot.val()) return dispatch(createKeyCard());
      return dispatch(setKeyCard(snapshot.val()));
    })
    .catch(err => console.error(err));
  }
);

// reducer
const initialState = { keys: [], startingTeam: '' };
export default function (prevState = initialState, action) {
  switch (action.type) {
    case SET_KEY_CARD:
      return action.keyCard;
    default:
      return prevState;
  }
}
