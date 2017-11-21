import { generateRoomCode } from '../utils';
import db from '../firebase/db';

// constants
const SET = 'SET_CODE';

// actions
const set = code => ({
  type: SET,
  code,
});

// thunks
export const createRoomCode = () => dispatch => {
  let code;
  return generateRoomCode()
  .then(_code => {
    code = _code;
    return db.ref(`rooms/${code}/board`).set({ roomCode: code });
  })
  .then(() => dispatch(set(code)));
};

// reducer
export default function (prevState = '', action) {
  switch (action.type) {
    case SET:
      return action.code;
    default:
      return prevState;
  }
}
