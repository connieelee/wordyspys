import db from '../../firebase/db';
import { generateRoomCode } from '../../utils/game';

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
export const createRoom = () => (
  function createRoomThunk(dispatch) {
    let code;
    return generateRoomCode()
    .then(_code => {
      code = _code;
      return db.ref(`rooms/${code}`).set({ roomCode: code });
    })
    .then(() => dispatch(setCode(code)))
    .catch(err => console.error(err));
  }
);
export const deleteRoom = () => (
  function deleteRoomThunk(dispatch, getState) {
    return db.ref(`rooms/${getState().roomCode.value}`).remove()
    .then(() => dispatch(unsetCode()))
    .catch(err => console.error(err));
  }
);
export const validateCode = code => (
  function validateCodeThunk(dispatch) {
    dispatch(resetErrors());
    return db.ref(`rooms/${code}`).once('value')
    .then(snapshot => {
      if (snapshot.val()) return null;
      return dispatch(addError(`Room ${code} does not exist`));
    })
    .catch(err => console.error(err));
  }
);
export const onRoomDisconnect = callback => (
  function onRoomDisconnectThunk(dispatch, getState) {
    const ref = db.ref(`rooms/${getState().roomCode.value}/roomCode`);
    const listener = snapshot => {
      if (!snapshot.val()) {
        callback();
        dispatch(unsetCode());
        ref.off('value', listener);
      }
    };
    ref.on('value', listener);
    return () => ref.off('value', listener);
  }
);

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
