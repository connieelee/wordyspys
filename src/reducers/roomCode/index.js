import { generateRoomCode } from '../../utils';
import db from '../../firebase/db';

// constants
const SET_CODE = 'SET_CODE';
const UNSET_CODE = 'UNSET_CODE';
const ADD_ERROR = 'ADD_ERROR';
const RESET_ERRORS = 'RESET_ERRORS';

// actions
export const setCode = code => ({ type: SET_CODE, code });
export const unsetCode = () => ({ type: UNSET_CODE });
const addError = error => ({ type: ADD_ERROR, error });
const resetErrors = () => ({ type: RESET_ERRORS });

// thunks
export const createRoom = () => dispatch => {
  let code;
  return generateRoomCode()
  .then(_code => {
    code = _code;
    return db.ref(`rooms/${code}`).set({ roomCode: code });
  })
  .then(() => dispatch(setCode(code)));
};
export const deleteRoom = () => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}`).remove()
  .then(() => dispatch(unsetCode()))
);
export const validateCode = code => dispatch => {
  dispatch(resetErrors());
  return db.ref(`rooms/${code}`).once('value')
  .then(snapshot => {
    if (snapshot.val()) return null;
    return dispatch(addError(`Room ${code} does not exist`));
  });
};

// reducer
const initialState = {
  value: '',
  errors: [],
};
export default function (prevState = initialState, action) {
  const nextState = Object.assign({}, prevState);
  switch (action.type) {
    case SET_CODE:
      nextState.value = action.code;
      return nextState;
    case UNSET_CODE:
      return initialState;
    case ADD_ERROR:
      nextState.errors = [...nextState.errors, action.error];
      return nextState;
    case RESET_ERRORS:
      nextState.errors = [];
      return nextState;
    default:
      return prevState;
  }
}
