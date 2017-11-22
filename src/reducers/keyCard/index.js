import db from '../../firebase/db';
import { generateKeyCard } from '../../utils';

// constants
const SET_KEYCARD = 'SET_KEYCARD';

// actions
const setKeyCard = keyCard => ({ type: SET_KEYCARD, keyCard });

// thunks
const createKeyCard = () => (dispatch, getState) => {
  const keyCard = generateKeyCard();
  return db.ref(`rooms/${getState().roomCode.value}/keyCard`).set(keyCard)
  .then(() => dispatch(setKeyCard(keyCard)));
};
export const readKeyCard = () => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/keyCard`).once('value')
  .then(snapshot => {
    if (!snapshot.val()) return dispatch(createKeyCard());
    return dispatch(setKeyCard(snapshot.val()));
  })
);

// reducer
const initialState = { keys: [], startingTeam: '' };
export default function (prevState = initialState, action) {
  switch (action.type) {
    case SET_KEYCARD:
      return action.keyCard;
    default:
      return prevState;
  }
}
