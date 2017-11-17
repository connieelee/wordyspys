import { generateRoomCode } from '../utils';

// constants
const SET = 'SET_CODE';

// actions
const set = code => ({
  type: SET,
  code,
});

// thunks
export const makeRoomCode = () => dispatch => (
  generateRoomCode()
  .then(code => dispatch(set(code)))
);

// reducer
export default function (prevState = '', action) {
  switch (action.type) {
    case SET:
      return action.code;
    default:
      return prevState;
  }
}
