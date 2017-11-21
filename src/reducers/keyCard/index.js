import db from '../../firebase/db';
import { generateKeyCard } from '../../utils';

// constants
const SET = 'SET_KEYCARD';

// actions
const set = keyCard => ({ type: SET, keyCard });

// thunks
export const createKeyCard = () => (dispatch, getState) => {
  const keyCard = generateKeyCard();
  return db.ref(`rooms/${getState().roomCode}/keyCard`).set(keyCard)
  .then(() => dispatch(set(keyCard)));
};

// reducer
const initialState = { keys: [], startingTeam: '' };
export default function (prevState = initialState, action) {
  switch (action.type) {
    case SET:
      return action.keyCard;
    default:
      return prevState;
  }
}
