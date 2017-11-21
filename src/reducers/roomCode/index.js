import { generateRoomCode } from '../../utils';
import db from '../../firebase/db';

// constants
const SET = 'SET_CODE';
const UNSET = 'UNSET_CODE';

// actions
const set = code => ({ type: SET, code });
const unset = () => ({ type: UNSET });

// thunks
export const createRoom = () => dispatch => {
  let code;
  return generateRoomCode()
  .then(_code => {
    code = _code;
    return db.ref(`rooms/${code}`).set({ roomCode: code });
  })
  .then(() => dispatch(set(code)));
};
export const deleteRoom = () => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode}`).remove()
  .then(() => dispatch(unset()))
);

// reducer
const initialState = '';
export default function (prevState = initialState, action) {
  switch (action.type) {
    case SET:
      return action.code;
    case UNSET:
      return initialState;
    default:
      return prevState;
  }
}
