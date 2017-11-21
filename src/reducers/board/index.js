import { generateBoard } from '../../utils';
import db from '../../firebase/db';

// constants
const SET_BOARD = 'SET_BOARD';

// actions
const setBoard = board => ({ type: SET_BOARD, board });

// thunks
export const createBoard = () => (dispatch, getState) => {
  let board;
  return generateBoard()
  .then(_board => {
    board = _board;
    return db.ref(`rooms/${getState().roomCode.value}/board`).set(board);
  })
  .then(() => dispatch(setBoard(board)));
};

// reducer
const initialState = [];
export default function (prevState = initialState, action) {
  switch (action.type) {
    case SET_BOARD:
      return action.board;
    default:
      return prevState;
  }
}
