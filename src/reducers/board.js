import { generateBoard } from '../utils';
import db from '../firebase/db';

// constants
const SET = 'SET_BOARD';

// actions
const set = board => ({
  type: SET,
  board,
});

// thunks
export const createBoard = () => (dispatch, getState) => {
  let board;
  return generateBoard()
  .then(_board => {
    board = _board;
    return db.ref(`rooms/${getState().roomCode}/board`).set(board);
  })
  .then(() => dispatch(set(board)));
};

// reducer
export default function (prevState = [], action) {
  switch (action.type) {
    case SET:
      return action.board;
    default:
      return prevState;
  }
}
