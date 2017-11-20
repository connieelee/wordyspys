import db from '../firebase/db';
import { generateKeyCard } from '../utils';

// constants
const SET = 'SET_KEYCARD';

// actions
const set = keyCard => ({
  type: SET,
  keyCard,
});

// thunks
export const makeAndSaveKeyCard = roomCode => dispatch => {
  const keyCard = generateKeyCard();
  return db.ref(`rooms/${roomCode}/keyCard`).set(keyCard)
  .then(() => dispatch(set(keyCard)));
};

// reducer
export default function (prevState = { keys: [], startingTeam: '' }, action) {
  switch (action.type) {
    case SET:
      return action.keyCard;
    default:
      return prevState;
  }
}
